const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { 
  registerValidation, 
  loginValidation,
  mobileVerificationValidation,
  validate 
} = require('../utils/validators');


router.post(
  '/register',
  registerValidation,
  validate,
  authController.register
);


router.post(
  '/login',
  loginValidation,
  validate,
  authController.login
);


router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);


router.post(
  '/verify-mobile',
  authenticate,
  mobileVerificationValidation,
  validate,
  authController.verifyMobile
);


router.post(
  '/verify-email',
  authenticate,
  authController.verifyEmail
);


router.put(
  '/profile',
  authenticate,
  authController.updateProfile
);


router.post(
  '/change-password',
  authenticate,
  authController.changePassword
);


router.post(
  '/logout',
  authenticate,
  authController.logout
);

module.exports = router;
