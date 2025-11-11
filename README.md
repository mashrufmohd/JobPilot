#  Company Registration & Verification Module

A full-stack web application for company registration with Firebase authentication, mobile/email verification, and company profile management with PostgreSQL and Cloudinary integration.

##  Features

- **User Registration & Authentication**
  - Firebase Email/Password authentication
  - SMS OTP verification for mobile numbers
  - Email verification via Firebase
  - JWT-based session management (90-day expiry)
  
- **Company Profile Management**
  - Multi-step company registration wizard
  - Logo & banner image uploads via Cloudinary
  - Complete company information (address, industry, social links)
  - Profile viewing and editing
  
- **Security**
  - bcrypt password hashing
  - JWT token authentication
  - Input validation and sanitization
  - Helmet.js security headers
  - CORS protection

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Redux Toolkit
- Material-UI (MUI)
- React Hook Form
- TanStack Query (React Query)
- Firebase SDK
- Cloudinary Widget
- Axios

### Backend
- Node.js + Express
- PostgreSQL 15
- Firebase Admin SDK
- Cloudinary SDK
- JWT + bcrypt
- Jest + Supertest

## 📁 Project Structure

```
project-root/
├── README.md
├── .gitignore
├── postman_collection.json
├── db/
│   └── company_db.sql
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── services/
│       ├── utils/
│       └── tests/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       ├── pages/
│       ├── components/
│       ├── store/
│       ├── hooks/
│       ├── styles/
│       ├── utils/
│       └── tests/
└── scripts/
    ├── setup_db.sh
    └── seed_sample_data.js
```

##  Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL v15+
- Firebase account
- Cloudinary account
- npm or yarn

### 1. Clone & Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb company_db

# Import schema
psql -d company_db -f db/company_db.sql

# OR use the setup script
chmod +x scripts/setup_db.sh
./scripts/setup_db.sh
```

### 3. Environment Variables

#### Backend (.env)
Copy `backend/.env.example` to `backend/.env` and fill in:

```env
BACKEND_PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/company_db
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_DAYS=90
BCRYPT_SALT_ROUNDS=10
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----\n"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

#### Frontend (.env)
Copy `frontend/.env.example` to `frontend/.env` and fill in:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password & Phone
4. Generate service account key (Settings → Service Accounts → Generate New Private Key)
5. Add the credentials to your backend `.env` file
6. Get web app config (Project Settings → Your Apps) for frontend `.env`

### 5. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from Dashboard
3. Create an unsigned upload preset:
   - Settings → Upload → Add upload preset
   - Signing Mode: Unsigned
   - Folder: `company_uploads`
4. Add credentials to both `.env` files

### 6. Run the Application

#### Backend
```bash
cd backend

# Development mode with hot reload
npm run dev

# Production mode
npm start

# Run tests
npm test
```

Backend will run on `http://localhost:5000`

#### Frontend
```bash
cd frontend

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

Frontend will run on `http://localhost:5173`

##  Testing

### Backend Tests
```bash
cd backend
npm test

# With coverage
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test

# With coverage
npm run test:coverage
```

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-mobile` - Verify mobile OTP
- `POST /api/auth/verify-email` - Verify email
- `GET /api/auth/me` - Get current user

### Company
- `POST /api/company` - Create company profile
- `GET /api/company/my-profile` - Get user's company profile
- `PUT /api/company/:id` - Update company profile
- `DELETE /api/company/:id` - Delete company profile

##  API Documentation

Import `postman_collection.json` into Postman for full API documentation and testing.

##  Design Reference

- **Figma Design**: https://www.figma.com/design/XrkHGt4e5Kt4CErCYS7sGz/4-Warm-UP-Assignment
- **Sample UI**: https://bluestock.in/backoffice-tech/company-module-sample/index.html
- **Database Reference**: https://bluestock.in/backoffice-tech/company_db

##  Security Features

- Password hashing with bcrypt (10 rounds)
- JWT authentication with 90-day expiry
- Input validation with express-validator
- HTML sanitization
- Helmet.js security headers
- CORS configuration
- SQL injection protection via parameterized queries

##  Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique, required
- `password` - bcrypt hashed
- `full_name` - Required
- `gender` - 'm', 'f', or 'o'
- `mobile_no` - Unique, required
- `is_mobile_verified` - Boolean
- `is_email_verified` - Boolean
- `signup_type` - Default 'e' (email)
- `created_at`, `updated_at` - Timestamps

### Company Profile Table
- `id` - Primary key
- `owner_id` - Foreign key to users
- `company_name` - Required
- `address`, `city`, `state`, `country`, `postal_code`
- `website` - Optional
- `logo_url`, `banner_url` - Cloudinary URLs
- `industry` - Required
- `founded_date` - Date
- `description` - Text
- `social_links` - JSONB
- `created_at`, `updated_at` - Timestamps

##  Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U postgres -d company_db
```

### Port Already in Use
```bash
# Find and kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Firebase Authentication Errors
- Ensure Firebase project has Email/Password and Phone authentication enabled
- Check that FIREBASE_PRIVATE_KEY has proper line breaks (`\n`)
- Verify Firebase service account has necessary permissions

### Cloudinary Upload Issues
- Ensure upload preset is set to "Unsigned"
- Check cloud name and preset name match exactly
- Verify CORS settings in Cloudinary dashboard

##  Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, Render, or AWS
- Set environment variables in platform dashboard
- Use PostgreSQL addon or external database

### Frontend (React)
- Deploy to Vercel, Netlify, or AWS S3
- Build with `npm run build`
- Set environment variables in platform dashboard

### Database
- Use managed PostgreSQL (Heroku Postgres, Railway, AWS RDS, Supabase)
- Run migration: `psql $DATABASE_URL -f db/company_db.sql`

##  Contributing

This is an internship assignment project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is created for educational purposes as part of an internship assignment.

##  Author

Your Name - Internship Assignment

##  Acknowledgments

- Figma design by assignment provider
- Firebase for authentication
- Cloudinary for image management
- PostgreSQL for database

---

**Note**: This is a development setup. For production deployment, ensure proper security measures, environment variable management, and error logging are in place.
