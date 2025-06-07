const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

const responseSchema = Joi.object({
  questionId: Joi.string()
    .pattern(/^[A-Z].*\d+$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid question ID format',
      'any.required': 'Question ID is required'
    }),
  responseValue: Joi.number()
    .integer()
    .min(1)
    .max(7),
  selectedOption: Joi.string()
    .valid('a', 'b')
}).xor('responseValue', 'selectedOption')
  .messages({
    'object.xor': 'Either responseValue or selectedOption must be provided, but not both'
  });

const batchResponsesSchema = Joi.array()
  .items(responseSchema)
  .min(1)
  .max(200);

const profileUpdateSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name cannot be empty',
      'string.max': 'Name must be less than 100 characters',
      'any.required': 'Name is required'
    })
});

module.exports = {
  signupSchema,
  loginSchema,
  responseSchema,
  batchResponsesSchema,
  profileUpdateSchema
};