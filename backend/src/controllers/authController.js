const User = require('../models/userModel');
const jwt = require('../utils/jwt');
const { asyncHandler, ValidationError, AuthenticationError } = require('../middleware/errorMiddleware');
const firebaseService = require('../services/firebaseService');


const register = asyncHandler(async (req, res) => {
  const { email, password, full_name, gender, mobile_no, firebase_uid } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new ValidationError('User with this email already exists');
  }

  // Check mobile number
  const existingMobile = await User.findByMobile(mobile_no);
  if (existingMobile) {
    throw new ValidationError('User with this mobile number already exists');
  }

  // Create user
  const user = await User.createUser({
    email,
    password,
    full_name,
    gender,
    mobile_no,
    signup_type: 'e'
  });

  // Generate JWT token
  const token = jwt.generateToken({
    userId: user.id,
    email: user.email
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        gender: user.gender,
        mobile_no: user.mobile_no,
        is_mobile_verified: user.is_mobile_verified,
        is_email_verified: user.is_email_verified
      },
      token,
      expiresIn: `${require('../config').jwt.expiresInDays} days`
    }
  });
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findByEmail(email);
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await User.verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.generateToken({
    userId: user.id,
    email: user.email
  });

  // Remove password from response
  delete user.password;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        gender: user.gender,
        mobile_no: user.mobile_no,
        is_mobile_verified: user.is_mobile_verified,
        is_email_verified: user.is_email_verified
      },
      token,
      expiresIn: `${require('../config').jwt.expiresInDays} days`
    }
  });
});


const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.getUserWithCompany(req.user.id);

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        gender: user.gender,
        mobile_no: user.mobile_no,
        is_mobile_verified: user.is_mobile_verified,
        is_email_verified: user.is_email_verified,
        signup_type: user.signup_type,
        created_at: user.user_created_at,
        company: user.company_id ? {
          id: user.company_id,
          name: user.company_name,
          logo_url: user.logo_url
        } : null
      }
    }
  });
});


const verifyMobile = asyncHandler(async (req, res) => {
  const { mobile_no, otp_code } = req.body;
  const userId = req.user.id;

  // In a real app, you would verify the OTP against a stored value
  // For now, we'll simulate Firebase verification
  // Firebase handles OTP verification on the client side
  
  // Update user's mobile verification status
  const updatedUser = await User.updateMobileVerification(userId, true);

  res.status(200).json({
    success: true,
    message: 'Mobile number verified successfully',
    data: {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        is_mobile_verified: updatedUser.is_mobile_verified,
        is_email_verified: updatedUser.is_email_verified
      }
    }
  });
});


const verifyEmail = asyncHandler(async (req, res) => {
  const { verification_token } = req.body;
  const userId = req.user.id;

  // Firebase handles email verification on the client side
  // This endpoint just updates our database
  
  // Update user's email verification status
  const updatedUser = await User.updateEmailVerification(userId, true);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    data: {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        is_mobile_verified: updatedUser.is_mobile_verified,
        is_email_verified: updatedUser.is_email_verified
      }
    }
  });
});


const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  // Don't allow email or password updates through this endpoint
  delete updates.email;
  delete updates.password;

  const updatedUser = await User.updateUser(userId, updates);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});


const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.id;

  // Get user with password
  const user = await User.findByEmail(req.user.email);

  // Verify current password
  const isValidPassword = await User.verifyPassword(current_password, user.password);
  if (!isValidPassword) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Update password
  await User.updatePassword(userId, new_password);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});


const logout = asyncHandler(async (req, res) => {
  // JWT is stateless, so logout is handled on client side by removing token
  // This endpoint is for logging purposes or blacklisting tokens if implemented

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
  verifyMobile,
  verifyEmail,
  updateProfile,
  changePassword,
  logout
};
