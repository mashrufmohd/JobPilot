const request = require('supertest');
const app = require('../app');
const db = require('../services/dbService');

describe('Company API Tests', () => {
  let authToken;
  let userId;
  let companyId;

  // Test user credentials
  const testUser = {
    email: `company-test${Date.now()}@example.com`,
    password: 'Test@1234',
    full_name: 'Company Test User',
    gender: 'f',
    mobile_no: `+91876543${Math.floor(1000 + Math.random() * 9000)}`
  };

  // Test company data
  const testCompany = {
    company_name: 'Test Tech Solutions Pvt Ltd',
    address: '456 Innovation Hub, Tech Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postal_code: '400001',
    website: 'https://testtech.com',
    industry: 'Software Development',
    founded_date: '2021-06-15',
    description: 'A leading software development company focused on innovative solutions.',
    social_links: {
      facebook: 'https://facebook.com/testtech',
      twitter: 'https://twitter.com/testtech',
      linkedin: 'https://linkedin.com/company/testtech'
    }
  };

  // Setup: Register and login user before tests
  beforeAll(async () => {
    // Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
  });

  // Cleanup after all tests
  afterAll(async () => {
    try {
      // Delete test company and user
      await db.query('DELETE FROM company_profile WHERE owner_id = $1', [userId]);
      await db.query('DELETE FROM users WHERE id = $1', [userId]);
    } catch (error) {
      // Ignore errors
    }
    await db.closePool();
  });

  describe('POST /api/company', () => {
    it('should create a new company profile', async () => {
      const response = await request(app)
        .post('/api/company')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCompany)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Company profile created successfully');
      expect(response.body.data).toHaveProperty('company');
      expect(response.body.data.company.company_name).toBe(testCompany.company_name);
      expect(response.body.data.company.owner_id).toBe(userId);

      // Save company ID for later tests
      companyId = response.body.data.company.id;
    });

    it('should fail to create duplicate company for same user', async () => {
      const response = await request(app)
        .post('/api/company')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCompany)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already have');
    });

    it('should fail to create company without authentication', async () => {
      const response = await request(app)
        .post('/api/company')
        .send(testCompany)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create company with invalid data', async () => {
      const anotherUser = {
        email: `another${Date.now()}@example.com`,
        password: 'Test@1234',
        full_name: 'Another User',
        gender: 'm',
        mobile_no: `+91765432${Math.floor(1000 + Math.random() * 9000)}`
      };

      // Register another user
      const regResponse = await request(app)
        .post('/api/auth/register')
        .send(anotherUser);

      const anotherToken = regResponse.body.data.token;
      const anotherUserId = regResponse.body.data.user.id;

      const response = await request(app)
        .post('/api/company')
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({
          company_name: 'A', // Too short
          industry: 'Tech'
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);

      // Cleanup
      await db.query('DELETE FROM users WHERE id = $1', [anotherUserId]);
    });
  });

  describe('GET /api/company/my-profile', () => {
    it('should get current user company profile', async () => {
      const response = await request(app)
        .get('/api/company/my-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('company');
      expect(response.body.data.company.id).toBe(companyId);
      expect(response.body.data.company.company_name).toBe(testCompany.company_name);
    });

    it('should fail to get company without authentication', async () => {
      const response = await request(app)
        .get('/api/company/my-profile')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/company/:id', () => {
    it('should get company by ID', async () => {
      const response = await request(app)
        .get(`/api/company/${companyId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('company');
      expect(response.body.data.company.id).toBe(companyId);
    });

    it('should return 404 for non-existent company', async () => {
      const response = await request(app)
        .get('/api/company/99999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .get('/api/company/invalid')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/company/:id', () => {
    it('should update company profile', async () => {
      const updates = {
        company_name: 'Updated Test Tech Solutions',
        description: 'Updated description for the company',
        website: 'https://updatedtesttech.com'
      };

      const response = await request(app)
        .put(`/api/company/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Company profile updated successfully');
      expect(response.body.data.company.company_name).toBe(updates.company_name);
      expect(response.body.data.company.description).toBe(updates.description);
    });

    it('should fail to update without authentication', async () => {
      const response = await request(app)
        .put(`/api/company/${companyId}`)
        .send({ company_name: 'Updated Name' })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail to update another user company', async () => {
      // Create another user
      const anotherUser = {
        email: `unauthorized${Date.now()}@example.com`,
        password: 'Test@1234',
        full_name: 'Unauthorized User',
        gender: 'm',
        mobile_no: `+91654321${Math.floor(1000 + Math.random() * 9000)}`
      };

      const regResponse = await request(app)
        .post('/api/auth/register')
        .send(anotherUser);

      const anotherToken = regResponse.body.data.token;
      const anotherUserId = regResponse.body.data.user.id;

      const response = await request(app)
        .put(`/api/company/${companyId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ company_name: 'Hacked Name' })
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not authorized');

      // Cleanup
      await db.query('DELETE FROM users WHERE id = $1', [anotherUserId]);
    });
  });

  describe('GET /api/company', () => {
    it('should get all companies with pagination', async () => {
      const response = await request(app)
        .get('/api/company?page=1&limit=10')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('companies');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('page');
      expect(Array.isArray(response.body.data.companies)).toBe(true);
    });
  });

  describe('GET /api/company/search', () => {
    it('should search companies by name', async () => {
      const response = await request(app)
        .get(`/api/company/search?q=${encodeURIComponent('Test Tech')}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('companies');
      expect(Array.isArray(response.body.data.companies)).toBe(true);
    });

    it('should fail without search query', async () => {
      const response = await request(app)
        .get('/api/company/search')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/company/:id', () => {
    it('should delete company profile', async () => {
      const response = await request(app)
        .delete(`/api/company/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Company profile deleted successfully');

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/company/${companyId}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);
    });
  });
});
