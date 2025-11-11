# 🔐 Security & Credentials Guide

## ⚠️ IMPORTANT: Never Commit These Files

The following files contain sensitive information and are **automatically ignored by git**:

### 🔑 Environment Files
- `.env` - Contains all API keys, database passwords, JWT secrets
- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration

### 🔥 Firebase Credentials
- `firebase-adminsdk-*.json` - Firebase service account keys
- `serviceAccountKey.json` - Firebase admin SDK credentials
- `.firebaserc` - Firebase project configuration

### 💾 Database Files
- `*.sql` files - May contain sensitive data
- `company_db.sql` - Database backup
- `*.db`, `*.sqlite` - Local database files

### 🔒 SSL & Certificates
- `*.pem`, `*.key`, `*.crt` - SSL certificates and private keys

### 📁 User Uploads
- `backend/uploads/` - User uploaded files (images, documents)

## ✅ Files That Are Tracked

These files are safe to commit and should be tracked:
- `.env.example` - Template for environment variables (no real values)
- Source code files (`.js`, `.jsx`)
- Configuration files (`package.json`, `vite.config.js`)
- Documentation (`README.md`)
- Database schema files (if they don't contain data)

## 🚀 Setup for New Developers

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobPilot
   ```

2. **Copy environment template files**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Fill in your credentials** in both `.env` files
   - Database connection
   - JWT secret
   - Firebase credentials
   - Cloudinary keys

4. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

## 🛡️ Security Best Practices

1. **Never commit** `.env` files
2. **Use strong** JWT secrets in production
3. **Change default** database passwords
4. **Enable** Firebase security rules
5. **Rotate** API keys regularly
6. **Use environment-specific** configurations
7. **Keep** `.gitignore` updated

## 📝 Creating Environment Files

### Backend `.env` Template
```env
BACKEND_PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env` Template
```env
VITE_API_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
```

## 🔍 Check for Exposed Credentials

Before committing, always verify:
```bash
git status
git diff
```

If you accidentally committed sensitive data:
1. Remove it from git history
2. Rotate all exposed credentials immediately
3. Update `.gitignore`

## 📞 Need Help?

If you accidentally exposed credentials:
1. **Immediately** change all affected passwords/keys
2. **Remove** the file from git history
3. **Contact** the team lead

---

**Remember**: Security is everyone's responsibility! 🔒
