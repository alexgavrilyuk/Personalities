const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateUser } = require('../middleware/auth');
const { 
  supabase,
  supabaseAdmin, 
  getUserResponses,
  getUserResponsesByType,
  saveUserResponse,
  getUserCompletions,
  markAssessmentComplete,
  getAssessmentSession,
  createAssessmentSession,
  updateAssessmentSession
} = require('../services/supabaseClient');
const { responseSchema, batchResponsesSchema } = require('../utils/validators');

// All response routes require authentication
router.use(authenticateUser);

// Save single response
router.post('/save', async (req, res, next) => {
  try {
    // Validate request body
    const { error: validationError, value } = responseSchema.validate(req.body);
    if (validationError) {
      return next(validationError);
    }
    
    const userId = req.user.id;
    const { questionId, responseValue, selectedOption } = value;
    
    // Get or create assessment session
    let session = await getAssessmentSession(userId);
    if (!session) {
      session = await createAssessmentSession(userId);
    }
    
    // Save the response
    await saveUserResponse(userId, questionId, responseValue, selectedOption);
    
    // Update session progress
    const { count } = await supabase
      .from('user_responses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    await updateAssessmentSession(session.id, {
      total_responses: count,
      last_question_index: parseInt(questionId.substring(1)) // Extract number from Q1, Q2, etc.
    });
    
    res.json({
      success: true,
      totalResponses: count
    });
  } catch (error) {
    next(error);
  }
});

// Save multiple responses (batch)
router.post('/batch', async (req, res, next) => {
  try {
    const { error: validationError, value } = batchResponsesSchema.validate(req.body.responses);
    if (validationError) {
      return next(validationError);
    }
    
    const userId = req.user.id;
    const responses = value;
    const assessmentType = 'core'; // Hardcoded for now, will be dynamic later
    
    console.log(`Batch save: ${responses.length} responses for user ${userId}`);
    
    // Prepare batch insert data with assessment_type
    const batchData = responses.map(response => ({
      user_id: userId,
      question_id: response.questionId,
      response_value: response.responseValue || null,
      selected_option: response.selectedOption || null,
      assessment_type: assessmentType,
      updated_at: new Date().toISOString()
    }));
    
    // Batch upsert
    const client = supabaseAdmin || supabase;
    const { error } = await client
      .from('user_responses')
      .upsert(batchData, {
        onConflict: 'user_id,question_id,assessment_type'
      });
    
    if (error) {
      return next(error);
    }
    
    // Get actual count for this assessment type
    const { count, error: countError } = await client
      .from('user_responses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('assessment_type', assessmentType);
    
    if (countError) {
      console.error('Error getting response count:', countError);
    }
    
    const totalResponses = count || 0;
    console.log(`Total responses after save: ${totalResponses}`);
    
    // Check if assessment is now complete
    if (assessmentType === 'core' && totalResponses === 200) {
      await markAssessmentComplete(userId, assessmentType, totalResponses);
      console.log(`Marked ${assessmentType} assessment as complete for user ${userId}`);
    }
    
    res.json({
      success: true,
      savedCount: responses.length,
      totalResponses: totalResponses,
      assessmentType: assessmentType
    });
  } catch (error) {
    next(error);
  }
});

// Get all user responses
router.get('/all', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const assessmentType = req.query.assessmentType || 'core'; // Support filtering by type
    const responses = await getUserResponsesByType(userId, assessmentType);
    
    res.json({
      responses: responses.map(r => ({
        questionId: r.question_id,
        responseValue: r.response_value,
        selectedOption: r.selected_option
      })),
      count: responses.length,
      assessmentType: assessmentType
    });
  } catch (error) {
    next(error);
  }
});

// Clear all responses (start over)
router.delete('/clear', async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Delete all user responses - use admin client to bypass RLS
    const client = supabaseAdmin || supabase;
    const { error } = await client
      .from('user_responses')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      return next(error);
    }
    
    // Mark current session as abandoned if exists
    const session = await getAssessmentSession(userId);
    if (session) {
      await updateAssessmentSession(session.id, {
        completed_at: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      message: 'All responses cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get responses for report generation
router.get('/report/:sessionId', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    
    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();
    
    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Get all responses
    const responses = await getUserResponses(userId);
    
    if (responses.length < 160) {
      return res.status(400).json({ 
        error: 'Insufficient responses for report generation',
        responsesCount: responses.length,
        minimumRequired: 160
      });
    }
    
    // Call BackendPip to generate report
    try {
      const backendPipUrl = process.env.BACKEND_PIP_URL || 'http://localhost:8000';
      const { data: report } = await axios.post(`${backendPipUrl}/api/submit-assessment`, {
        responses: responses.map(r => ({
          questionId: r.question_id,
          value: r.response_value || (r.selected_option === 'a' ? 1 : 2)
        }))
      });
      
      res.json({
        report,
        sessionId,
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