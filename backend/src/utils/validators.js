const { body, param, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');


const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
};


const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};


const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .customSanitizer(sanitizeInput),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('full_name')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters')
    .customSanitizer(sanitizeInput),
  
  body('gender')
    .isIn(['m', 'f', 'o'])
    .withMessage('Gender must be m (male), f (female), or o (other)'),
  
  body('mobile_no')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid mobile number with country code (E.164 format)')
    .customSanitizer(sanitizeInput),
  
  body('firebase_uid')
    .optional()
    .isString()
    .withMessage('Firebase UID must be a string')
    .customSanitizer(sanitizeInput)
];


const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .customSanitizer(sanitizeInput),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];


const companyValidation = [
  body('company_name')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Company name must be between 2 and 255 characters')
    .customSanitizer(sanitizeInput),
  
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters')
    .customSanitizer(sanitizeInput),
  
  body('city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters')
    .customSanitizer(sanitizeInput),
  
  body('state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters')
    .customSanitizer(sanitizeInput),
  
  body('country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters')
    .customSanitizer(sanitizeInput),
  
  body('postal_code')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Postal code must not exceed 20 characters')
    .customSanitizer(sanitizeInput),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL')
    .customSanitizer(sanitizeInput),
  
  body('logo_url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid logo URL')
    .customSanitizer(sanitizeInput),
  
  body('banner_url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid banner URL')
    .customSanitizer(sanitizeInput),
  
  body('industry')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Industry must not exceed 100 characters')
    .customSanitizer(sanitizeInput),
  
  body('founded_date')
    .optional()
    .isDate()
    .withMessage('Please provide a valid date in YYYY-MM-DD format'),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters')
    .customSanitizer(sanitizeInput),
  
  body('social_links')
    .optional()
    .isObject()
    .withMessage('Social links must be an object'),
  
  body('social_links.facebook')
    .optional()
    .isURL()
    .withMessage('Facebook URL must be valid'),
  
  body('social_links.twitter')
    .optional()
    .isURL()
    .withMessage('Twitter URL must be valid'),
  
  body('social_links.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be valid'),
  
  body('social_links.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram URL must be valid')
];


const mobileVerificationValidation = [
  body('mobile_no')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid mobile number')
    .customSanitizer(sanitizeInput),
  
  body('otp_code')
    .isLength({ min: 4, max: 6 })
    .withMessage('OTP must be 4-6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];


const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid ID parameter')
];


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};


const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


const validatePasswordStrength = (password) => {
  const result = {
    isValid: false,
    strength: 'weak',
    errors: []
  };
  
  if (password.length < 8) {
    result.errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    result.errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    result.errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    result.errors.push('Password must contain at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    result.errors.push('Password must contain at least one special character');
  }
  
  if (result.errors.length === 0) {
    result.isValid = true;
    result.strength = password.length >= 12 ? 'strong' : 'medium';
  }
  
  return result;
};

module.exports = {
  sanitizeInput,
  validate,
  registerValidation,
  loginValidation,
  companyValidation,
  mobileVerificationValidation,
  idValidation,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  validatePasswordStrength
};
