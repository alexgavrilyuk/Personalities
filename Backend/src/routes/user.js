const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { 
  supabase, 
  getUserResponsesByType, 
  getUserCompletions 
} = require('../services/supabaseClient');
const { profileUpdateSchema } = require('../utils/validators');
const axios = require('axios');

// All user routes require authentication
router.use(authenticateUser);

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = req.user;
    
    // Get user metadata from Supabase
    const { data, error } = await supabase
      .from('auth.users')
      .select('email, raw_user_meta_data')
      .eq('id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      return next(error);
    }
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || null,
      created_at: user.created_at
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile (name only for now)
router.put('/profile', async (req, res, next) => {
  try {
    // Validate request body
    const { error: validationError, value } = profileUpdateSchema.validate(req.body);
    if (validationError) {
      return next(validationError);
    }
    
    const { name } = value;
    const userId = req.user.id;
    
    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: { name }
    });
    
    if (error) {
      return next(error);
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: userId,
        email: req.user.email,
        name
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get assessment progress
router.get('/progress', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const assessmentType = req.query.assessmentType || 'core';
    
    // Get responses for specific assessment type
    const responses = await getUserResponsesByType(userId, assessmentType);
    const responsesCount = responses.length;
    
    // Get completion status
    const completions = await getUserCompletions(userId);
    const isComplete = completions.some(c => c.assessment_type === assessmentType);
    
    // Calculate expected question count (hardcoded for now)
    const expectedCount = assessmentType === 'core' ? 200 : 50;
    
    res.json({
      totalResponses: responsesCount,
      completionPercentage: Math.round((responsesCount / expectedCount) * 100),
      isComplete: isComplete,
      assessmentType: assessmentType,
      expectedQuestions: expectedCount
    });
  } catch (error) {
    next(error);
  }
});

// Get user completions
router.get('/completions', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const completions = await getUserCompletions(userId);
    
    res.json({
      completions: completions.map(c => ({
        assessmentType: c.assessment_type,
        completedAt: c.completed_at,
        responseCount: c.response_count
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Get report for completed assessment
router.get('/report/:assessmentType?', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const assessmentType = req.params.assessmentType || 'core';
    
    // Check if assessment is complete
    const completions = await getUserCompletions(userId);
    const completion = completions.find(c => c.assessment_type === assessmentType);
    
    if (!completion) {
      return res.status(400).json({ 
        error: `${assessmentType} assessment not completed`
      });
    }
    
    // Get all responses for this assessment type
    const responses = await getUserResponsesByType(userId, assessmentType);
    
    // Call BackendPip to generate report
    try {
      const backendPipUrl = process.env.BACKEND_PIP_URL || 'http://localhost:8000';
      const { data: report } = await axios.post(`${backendPipUrl}/api/submit-assessment`, {
        responses: responses.map(r => ({
          question_id: r.question_id,
          response_value: r.response_value,
          selected_option: r.selected_option
        })),
        assessment_types: [assessmentType] // Future: could be ['core', 'relationships']
      });
      
      res.json({
        report,
        assessmentType,
        completedAt: completion.completed_at,
        generatedAt: new Date().toISOString()
      });
    } catch (backendError) {
      console.error('BackendPip error:', backendError);
      return res.status(503).json({ 
        error: 'Assessment processing service unavailable' 
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;