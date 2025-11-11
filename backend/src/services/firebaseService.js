const admin = require('firebase-admin');
const config = require('../config');

// Initialize Firebase Admin SDK
let firebaseApp = null;

const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Check if Firebase credentials are configured
    if (!config.firebase.projectId || !config.firebase.clientEmail || !config.firebase.privateKey) {
      console.warn('⚠️  Firebase credentials not configured. Firebase features will be disabled.');
      return null;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      })
    });

    console.log('✅ Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    return null;
  }
};

// Initialize Firebase on module load
initializeFirebase();


const verifyIdToken = async (idToken) => {
  if (!firebaseApp) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('❌ Firebase token verification error:', error);
    throw new Error('Invalid Firebase token');
  }
};


const getUserByUid = async (uid) => {
  if (!firebaseApp) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('❌ Firebase get user error:', error);
    throw new Error('User not found in Firebase');
  }
};


const getUserByEmail = async (email) => {
  if (!firebaseApp) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error('❌ Firebase get user by email error:', error);
    throw new Error('User not found in Firebase');
  }
};


const verifyPhoneNumber = async (uid, phoneNumber) => {
  if (!firebaseApp) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord.phoneNumber === phoneNumber;
  } catch (error) {
    console.error('❌ Firebase phone verification error:', error);
    return false;
  }
};


const sendVerificationEmail = async (email) => {
  // Firebase email verification is typically handled on the client side
  // This is a placeholder for any server-side email operations
  console.log(`📧 Email verification would be sent to: ${email}`);
  return { success: true, message: 'Email verification initiated' };
};


const setCustomUserClaims = async (uid, claims) => {
  if (!firebaseApp) {
    throw new Error('Firebase is not initialized');
  }

  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`✅ Custom claims set for user: ${uid}`);
  } catch (error) {
    console.error('❌ Firebase set custom claims error:', error);
    throw new Error('Failed to set custom claims');
  }
};


const deleteUser = async (uid) => {
  if (!firebaseApp) {
    throw new Error('Firebase is not initialized');
  }

  try {
    await admin.auth().deleteUser(uid);
    console.log(`✅ Firebase user deleted: ${uid}`);
  } catch (error) {
    console.error('❌ Firebase delete user error:', error);
    throw new Error('Failed to delete Firebase user');
  }
};

module.exports = {
  initializeFirebase,
  verifyIdToken,
  getUserByUid,
  getUserByEmail,
  verifyPhoneNumber,
  sendVerificationEmail,
  setCustomUserClaims,
  deleteUser,
  isInitialized: () => firebaseApp !== null
};
