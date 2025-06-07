const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Public client for regular operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Admin client for service-level operations (if service key is provided)
let supabaseAdmin = null;
if (process.env.SUPABASE_SERVICE_KEY) {
  supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// Helper functions
const getUserResponses = async (userId) => {
  const client = supabaseAdmin || supabase;
  const { data, error } = await client
    .from('user_responses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

const saveUserResponse = async (userId, questionId, responseValue, selectedOption) => {
  const client = supabaseAdmin || supabase;
  const { data, error } = await client
    .from('user_responses')
    .upsert({
      user_id: userId,
      question_id: questionId,
      response_value: responseValue,
      selected_option: selectedOption,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,question_id'
    });
  
  if (error) throw error;
  return data;
};

const getAssessmentSession = async (userId) => {
  const client = supabaseAdmin || supabase;
  const { data, error } = await client
    .from('assessment_sessions')
    .select('*')
    .eq('user_id', userId)
    .is('completed_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return data;
};

const createAssessmentSession = async (userId) => {
  const client = supabaseAdmin || supabase;
  const { data, error } = await client
    .from('assessment_sessions')
    .insert({
      user_id: userId
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

const updateAssessmentSession = async (sessionId, updates) => {
  const client = supabaseAdmin || supabase;
  const { data, error } = await client
    .from('assessment_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

module.exports = {
  supabase,
  supabaseAdmin,
  getUserResponses,
  saveUserResponse,
  getAssessmentSession,
  createAssessmentSession,
  updateAssessmentSession
};