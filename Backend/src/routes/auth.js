const express = require('express');
const router = express.Router();
const { supabase } = require('../services/supabaseClient');
const { signupSchema, loginSchema } = require('../utils/validators');

// Sign up new user
router.post('/signup', async (req, res, next) => {
  try {
    // Validate request body
    const { error: validationError, value } = signupSchema.validate(req.body);
    if (validationError) {
      return next(validationError);
    }
    
    const { email, password } = value;
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          created_at: new Date().toISOString()
        }
      }
    });
    
    if (error) {
      return next(error);
    }
    
    res.status(201).json({
      user: data.user,
      session: data.session
    });
  } catch (error) {
    next(error);
  }
});

// Sign in existing user
router.post('/login', async (req, res, next) => {
  try {
    // Validate request body
    const { error: validationError, value } = loginSchema.validate(req.body);
    if (validationError) {
      return next(validationError);
    }
    
    const { email, password } = value;
    
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return next(error);
    }
    
    res.json({
      user: data.user,
      session: data.session
    });
  } catch (error) {
    next(error);
  }
});

// Sign out
router.post('/logout', async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return next(error);
    }
    
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    next(error);
  }
});

// Get current session
router.get('/session', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ user: null, session: null });
    }
    
    const token = authHeader.substring(7);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.json({ user: null, session: null });
    }
    
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Refresh session token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });
    
    if (error) {
      return next(error);
    }
    
    res.json({
      session: data.session
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;