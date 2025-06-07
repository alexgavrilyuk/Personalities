const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { supabase, getUserResponses, getAssessmentSession } = require('../services/supabaseClient');
const { profileUpdateSchema } = require('../utils/validators');

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
    
    // Get user responses count - need to use getUserResponses helper
    console.log('Checking progress for user:', userId);
    const responses = await getUserResponses(userId);
    const responsesCount = responses.length;
    console.log('Found responses:', responsesCount);
    
    // Get active assessment session
    const session = await getAssessmentSession(userId);
    
    res.json({
      totalResponses: responsesCount || 0,
      completionPercentage: Math.round(((responsesCount || 0) / 200) * 100),
      lastQuestionIndex: session?.last_question_index || 0,
      hasActiveSession: !!session,
      sessionId: session?.id || null
    });
  } catch (error) {
    next(error);
  }
});

// Get all completed assessments
router.get('/assessments', async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all assessment sessions
    const { data: sessions, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });
    
    if (error) {
      return next(error);
    }
    
    res.json({
      assessments: sessions.map(session => ({
        id: session.id,
        startedAt: session.started_at,
        completedAt: session.completed_at,
        totalResponses: session.total_responses,
        isComplete: session.total_responses >= 160
      }))
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;