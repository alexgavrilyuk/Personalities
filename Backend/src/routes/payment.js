const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const supabaseClient = require('../services/supabaseClient');

// Placeholder Stripe configuration
// In production, use: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PRICE_USD = 24.99;

// Create payment intent (placeholder)
router.post('/create-payment-intent', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user already has premium
    const { data: existingPremium } = await supabaseClient
      .from('user_premium')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    if (existingPremium) {
      return res.status(400).json({ 
        error: 'User already has premium access' 
      });
    }
    
    // In production, create actual Stripe payment intent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: 2499, // $24.99 in cents
    //   currency: 'usd',
    //   metadata: {
    //     user_id: userId
    //   }
    // });
    
    // Placeholder response
    const mockPaymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_test_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: 2499,
      currency: 'usd',
      status: 'requires_payment_method'
    };
    
    res.json({ 
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntentId: mockPaymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm premium purchase (placeholder)
router.post('/confirm-purchase', authenticateUser, async (req, res) => {
  try {
    const { payment_intent_id } = req.body;
    const userId = req.user.id;
    
    if (!payment_intent_id) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }
    
    // In production, verify payment with Stripe
    // const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    // if (paymentIntent.status !== 'succeeded') {
    //   throw new Error('Payment not successful');
    // }
    
    // For demo, simulate successful payment
    const mockPaymentVerified = payment_intent_id.startsWith('pi_');
    
    if (!mockPaymentVerified) {
      return res.status(400).json({ error: 'Invalid payment intent' });
    }
    
    // Record purchase in database
    const { data, error } = await supabaseClient
      .from('user_premium')
      .insert({
        user_id: userId,
        payment_reference: payment_intent_id,
        amount: PRICE_USD,
        payment_status: 'completed'
      });
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to record purchase' });
    }
    
    res.json({ 
      success: true,
      message: 'Premium access activated successfully',
      features: [
        'Relationship Dynamics Assessment',
        'Career Alignment Profile',
        'Emotional Intelligence Mapping',
        'Leadership Potential Analysis',
        'Creative Expression Profile',
        'Unlimited Team Comparisons',
        'Advanced Personality Reports'
      ]
    });
  } catch (error) {
    console.error('Purchase confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm purchase' });
  }
});

// Check premium status
router.get('/premium-status', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { data: premiumData, error } = await supabaseClient
      .from('user_premium')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to check premium status' });
    }
    
    const isPremium = !!premiumData;
    
    res.json({
      is_premium: isPremium,
      purchased_at: premiumData?.purchased_at || null,
      features: isPremium ? [
        'Relationship Dynamics Assessment',
        'Career Alignment Profile',
        'Emotional Intelligence Mapping',
        'Leadership Potential Analysis',
        'Creative Expression Profile',
        'Unlimited Team Comparisons',
        'Advanced Personality Reports'
      ] : []
    });
  } catch (error) {
    console.error('Premium status check error:', error);
    res.status(500).json({ error: 'Failed to check premium status' });
  }
});

// Demo endpoint to grant premium (development only)
if (process.env.NODE_ENV !== 'production') {
  router.post('/grant-premium-demo', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Check if already premium
      const { data: existing } = await supabaseClient
        .from('user_premium')
        .select('user_id')
        .eq('user_id', userId)
        .single();
      
      if (existing) {
        return res.json({ 
          success: true, 
          message: 'User already has premium access' 
        });
      }
      
      // Grant premium
      const { data, error } = await supabaseClient
        .from('user_premium')
        .insert({
          user_id: userId,
          payment_reference: 'DEMO_GRANT',
          amount: 0,
          payment_status: 'demo'
        });
      
      if (error) {
        throw error;
      }
      
      res.json({ 
        success: true,
        message: 'Premium access granted (demo mode)' 
      });
    } catch (error) {
      console.error('Demo grant error:', error);
      res.status(500).json({ error: 'Failed to grant premium access' });
    }
  });
}

module.exports = router;