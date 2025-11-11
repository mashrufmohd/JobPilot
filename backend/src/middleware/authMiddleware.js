const jwt = require('../utils/jwt');
const User = require('../models/userModel');


const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = jwt.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid token'
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};


const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwt.extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = jwt.verifyToken(token);
        const user = await User.findById(decoded.userId);
        
        if (user) {
          req.user = user;
          req.token = token;
        }
      } catch (error) {
        // Token invalid or expired, continue without user
        console.log('⚠️ Optional auth: Invalid token');
      }
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};


const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.is_email_verified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};


const requireMobileVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.is_mobile_verified) {
    return res.status(403).json({
      success: false,
      message: 'Mobile verification required',
      code: 'MOBILE_NOT_VERIFIED'
    });
  }

  next();
};


const requireFullyVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.is_email_verified || !req.user.is_mobile_verified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required',
      code: 'ACCOUNT_NOT_VERIFIED',
      details: {
        email_verified: req.user.is_email_verified,
        mobile_verified: req.user.is_mobile_verified
      }
    });
  }

  next();
};


const requestCounts = new Map();

const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const identifier = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or initialize request log for this identifier
    if (!requestCounts.has(identifier)) {
      requestCounts.set(identifier, []);
    }

    const requests = requestCounts.get(identifier);

    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    requestCounts.set(identifier, recentRequests);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    recentRequests.push(now);

    next();
  };
};


setInterval(() => {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour

  for (const [identifier, requests] of requestCounts.entries()) {
    const recentRequests = requests.filter(timestamp => now - timestamp < maxAge);
    
    if (recentRequests.length === 0) {
      requestCounts.delete(identifier);
    } else {
      requestCounts.set(identifier, recentRequests);
    }
  }
}, 10 * 60 * 1000); // Clean up every 10 minutes

module.exports = {
  authenticate,
  optionalAuth,
  requireEmailVerified,
  requireMobileVerified,
  requireFullyVerified,
  rateLimit
};
