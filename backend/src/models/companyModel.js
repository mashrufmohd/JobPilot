const db = require('../services/dbService');


const createCompany = async (ownerId, companyData) => {
  const {
    company_name,
    address,
    city,
    state,
    country = 'India',
    postal_code,
    website,
    logo_url,
    banner_url,
    industry,
    organization_type,
    team_size,
    founded_date,
    description,
    social_links = {}
  } = companyData;

  const query = `
    INSERT INTO company_profile (
      owner_id, company_name, address, city, state, country, 
      postal_code, website, logo_url, banner_url, industry, 
      organization_type, team_size, founded_date, description, social_links
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *
  `;

  const values = [
    ownerId,
    company_name,
    address,
    city,
    state,
    country,
    postal_code,
    website,
    logo_url,
    banner_url,
    industry,
    organization_type,
    team_size,
    founded_date,
    description,
    JSON.stringify(social_links)
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'unique_owner') {
      throw new Error('User already has a company profile');
    }
    throw error;
  }
};


const findById = async (companyId) => {
  const query = `
    SELECT * FROM company_profile WHERE id = $1
  `;

  const result = await db.query(query, [companyId]);
  return result.rows[0] || null;
};


const findByOwnerId = async (ownerId) => {
  const query = `
    SELECT * FROM company_profile WHERE owner_id = $1
  `;

  const result = await db.query(query, [ownerId]);
  return result.rows[0] || null;
};


const findByName = async (companyName) => {
  const query = `
    SELECT * FROM company_profile 
    WHERE company_name ILIKE $1
    ORDER BY created_at DESC
  `;

  const result = await db.query(query, [`%${companyName}%`]);
  return result.rows;
};


const updateCompany = async (companyId, updates) => {
  const allowedFields = [
    'company_name',
    'address',
    'city',
    'state',
    'country',
    'postal_code',
    'website',
    'logo_url',
    'banner_url',
    'industry',
    'organization_type',
    'team_size',
    'founded_date',
    'description',
    'social_links'
  ];

  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key) && updates[key] !== undefined) {
      if (key === 'social_links') {
        fields.push(`${key} = $${paramCount}`);
        values.push(JSON.stringify(updates[key]));
      } else {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
      }
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(companyId);

  const query = `
    UPDATE company_profile
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};


const deleteCompany = async (companyId) => {
  const query = `DELETE FROM company_profile WHERE id = $1`;
  const result = await db.query(query, [companyId]);
  return result.rowCount > 0;
};


const getCompanyWithOwner = async (companyId) => {
  const query = `
    SELECT 
      c.*,
      u.email as owner_email,
      u.full_name as owner_name,
      u.mobile_no as owner_mobile
    FROM company_profile c
    INNER JOIN users u ON c.owner_id = u.id
    WHERE c.id = $1
  `;

  const result = await db.query(query, [companyId]);
  return result.rows[0] || null;
};


const getAllCompanies = async (limit = 10, offset = 0) => {
  const countQuery = `SELECT COUNT(*) FROM company_profile`;
  const dataQuery = `
    SELECT 
      c.*,
      u.full_name as owner_name
    FROM company_profile c
    INNER JOIN users u ON c.owner_id = u.id
    ORDER BY c.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const countResult = await db.query(countQuery);
  const dataResult = await db.query(dataQuery, [limit, offset]);

  return {
    companies: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  };
};


const findByIndustry = async (industry) => {
  const query = `
    SELECT * FROM company_profile 
    WHERE industry ILIKE $1
    ORDER BY created_at DESC
  `;

  const result = await db.query(query, [`%${industry}%`]);
  return result.rows;
};


const isOwner = async (companyId, userId) => {
  const query = `
    SELECT 1 FROM company_profile 
    WHERE id = $1 AND owner_id = $2
  `;

  const result = await db.query(query, [companyId, userId]);
  return result.rows.length > 0;
};

module.exports = {
  createCompany,
  findById,
  findByOwnerId,
  findByName,
  updateCompany,
  deleteCompany,
  getCompanyWithOwner,
  getAllCompanies,
  findByIndustry,
  isOwner
};
