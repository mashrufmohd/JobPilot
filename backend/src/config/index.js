require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.BACKEND_PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/company_db',
    // Parse connection string for individual components if needed
    get host() {
      const match = this.url.match(/@([^:]+):/);
      return match ? match[1] : 'localhost';
    },
    get port() {
      const match = this.url.match(/:(\d+)\//);
      return match ? parseInt(match[1]) : 5432;
    },
    get database() {
      const match = this.url.match(/\/([^?]+)/);
      return match ? match[1] : 'company_db';
    },
    get user() {
      const match = this.url.match(/\/\/([^:]+):/);
      return match ? match[1] : 'postgres';
    },
    get password() {
      const match = this.url.match(/:([^@]+)@/);
      return match ? match[1] : 'password';
    }
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
    expiresInDays: parseInt(process.env.JWT_EXPIRES_DAYS) || 90
  },
  
  // Bcrypt Configuration
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
  },
  
  // Firebase Configuration
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  
  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  },
  
  // CORS Configuration
  corsOrigins: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000']
};

// Validate critical configuration
const validateConfig = () => {
  const required = [
    { key: 'JWT_SECRET', value: config.jwt.secret },
    { key: 'DATABASE_URL', value: config.database.url }
  ];
  
  const missing = required.filter(item => !item.value || item.value.includes('your_'));
  
  if (missing.length > 0 && config.nodeEnv === 'production') {
    console.warn('⚠️  Warning: Missing or default configuration values:');
    missing.forEach(item => console.warn(`   - ${item.key}`));
  }
};

validateConfig();

module.exports = config;
