const db = require('../services/dbService');
const bcrypt = require('bcrypt');
const config = require('../config');


const createUser = async (userData) => {
  const {
    email,
    password,
    full_name,
    gender,
    mobile_no,
    signup_type = 'e'
  } = userData;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  const query = `
    INSERT INTO users (email, password, full_name, gender, mobile_no, signup_type)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, full_name, gender, mobile_no, is_mobile_verified, 
              is_email_verified, signup_type, created_at, updated_at
  `;

  const values = [email, hashedPassword, full_name, gender, mobile_no, signup_type];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      if (error.constraint === 'users_email_key') {
        throw new Error('Email already exists');
      } else if (error.constraint === 'users_mobile_no_key') {
        throw new Error('Mobile number already exists');
      }
    }
    throw error;
  }
};


const findByEmail = async (email) => {
  const query = `
    SELECT id, email, password, full_name, gender, mobile_no, 
           is_mobile_verified, is_email_verified, signup_type, 
           created_at, updated_at
    FROM users
    WHERE email = $1
  `;

  const result = await db.query(query, [email]);
  return result.rows[0] || null;
};


const findById = async (id) => {
  const query = `
    SELECT id, email, full_name, gender, mobile_no, 
           is_mobile_verified, is_email_verified, signup_type, 
           created_at, updated_at
    FROM users
    WHERE id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};


const findByMobile = async (mobile_no) => {
  const query = `
    SELECT id, email, full_name, gender, mobile_no, 
           is_mobile_verified, is_email_verified, signup_type, 
           created_at, updated_at
    FROM users
    WHERE mobile_no = $1
  `;

  const result = await db.query(query, [mobile_no]);
  return result.rows[0] || null;
};


const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};


const updateMobileVerification = async (userId, isVerified) => {
  const query = `
    UPDATE users
    SET is_mobile_verified = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, email, full_name, is_mobile_verified, is_email_verified
  `;

  const result = await db.query(query, [isVerified, userId]);
  return result.rows[0];
};


const updateEmailVerification = async (userId, isVerified) => {
  const query = `
    UPDATE users
    SET is_email_verified = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, email, full_name, is_mobile_verified, is_email_verified
  `;

  const result = await db.query(query, [isVerified, userId]);
  return result.rows[0];
};


const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

  const query = `
    UPDATE users
    SET password = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, email, full_name
  `;

  const result = await db.query(query, [hashedPassword, userId]);
  return result.rows[0];
};


const updateUser = async (userId, updates) => {
  const allowedFields = ['full_name', 'gender', 'mobile_no'];
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key) && updates[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(updates[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(userId);

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, email, full_name, gender, mobile_no, 
              is_mobile_verified, is_email_verified, updated_at
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};


const deleteUser = async (userId) => {
  const query = `DELETE FROM users WHERE id = $1`;
  const result = await db.query(query, [userId]);
  return result.rowCount > 0;
};


const getUserWithCompany = async (userId) => {
  const query = `
    SELECT 
      u.id, u.email, u.full_name, u.gender, u.mobile_no,
      u.is_mobile_verified, u.is_email_verified, u.signup_type,
      u.created_at as user_created_at,
      c.id as company_id, c.company_name, c.logo_url
    FROM users u
    LEFT JOIN company_profile c ON u.id = c.owner_id
    WHERE u.id = $1
  `;

  const result = await db.query(query, [userId]);
  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  findByMobile,
  verifyPassword,
  updateMobileVerification,
  updateEmailVerification,
  updatePassword,
  updateUser,
  deleteUser,
  getUserWithCompany
};
