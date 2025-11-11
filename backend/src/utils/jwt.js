const jwt = require('jsonwebtoken');
const config = require('../config');


const generateToken = (payload) => {
  try {
    const expiresIn = `${config.jwt.expiresInDays}d`;
    
    const token = jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn }
    );
    
    return token;
  } catch (error) {
    console.error('❌ JWT generation error:', error);
    throw new Error('Token generation failed');
  }
};


const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};


const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('❌ JWT decode error:', error);
    return null;
  }
};


const generateRefreshToken = (payload) => {
  try {
    const expiresIn = '180d'; // 6 months
    
    const token = jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn }
    );
    
    return token;
  } catch (error) {
    console.error('❌ Refresh token generation error:', error);
    throw new Error('Refresh token generation failed');
  }
};


const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};


const getTokenExpiry = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('❌ Error getting token expiry:', error);
    return null;
  }
};


const isTokenExpired = (token) => {
  try {
    const expiry = getTokenExpiry(token);
    if (!expiry) return true;
    
    return expiry < new Date();
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  extractTokenFromHeader,
  getTokenExpiry,
  isTokenExpired
};
