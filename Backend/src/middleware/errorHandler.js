const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details.map(detail => detail.message)
    });
  }
  
  // Supabase errors
  if (err.code && err.message) {
    return res.status(400).json({
      error: err.message,
      code: err.code
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;