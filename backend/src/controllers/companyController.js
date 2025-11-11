const Company = require('../models/companyModel');
const { asyncHandler, ValidationError, AuthorizationError, NotFoundError } = require('../middleware/errorMiddleware');


const createCompany = asyncHandler(async (req, res) => {
  const ownerId = req.user.id;
  const companyData = req.body;

  // Check if user already has a company
  const existingCompany = await Company.findByOwnerId(ownerId);
  if (existingCompany) {
    throw new ValidationError('You already have a company profile');
  }

  // Create company
  const company = await Company.createCompany(ownerId, companyData);

  res.status(201).json({
    success: true,
    message: 'Company profile created successfully',
    data: {
      company
    }
  });
});


const getMyCompany = asyncHandler(async (req, res) => {
  const ownerId = req.user.id;

  const company = await Company.findByOwnerId(ownerId);

  if (!company) {
    throw new NotFoundError('Company profile not found');
  }

  res.status(200).json({
    success: true,
    data: {
      company
    }
  });
});


const getCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.getCompanyWithOwner(parseInt(id));

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  res.status(200).json({
    success: true,
    data: {
      company
    }
  });
});


const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.id;

  // Check if company exists
  const company = await Company.findById(parseInt(id));
  if (!company) {
    throw new NotFoundError('Company not found');
  }

  // Check ownership
  if (company.owner_id !== userId) {
    throw new AuthorizationError('You are not authorized to update this company');
  }

  // Update company
  const updatedCompany = await Company.updateCompany(parseInt(id), updates);

  res.status(200).json({
    success: true,
    message: 'Company profile updated successfully',
    data: {
      company: updatedCompany
    }
  });
});


const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check if company exists
  const company = await Company.findById(parseInt(id));
  if (!company) {
    throw new NotFoundError('Company not found');
  }

  // Check ownership
  if (company.owner_id !== userId) {
    throw new AuthorizationError('You are not authorized to delete this company');
  }

  // Delete company
  await Company.deleteCompany(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Company profile deleted successfully'
  });
});


const getAllCompanies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const result = await Company.getAllCompanies(limit, offset);

  res.status(200).json({
    success: true,
    data: result
  });
});


const searchCompanies = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ValidationError('Search query is required');
  }

  const companies = await Company.findByName(q);

  res.status(200).json({
    success: true,
    data: {
      companies,
      count: companies.length
    }
  });
});


const getCompaniesByIndustry = asyncHandler(async (req, res) => {
  const { industry } = req.params;

  const companies = await Company.findByIndustry(industry);

  res.status(200).json({
    success: true,
    data: {
      companies,
      count: companies.length
    }
  });
});

module.exports = {
  createCompany,
  getMyCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  searchCompanies,
  getCompaniesByIndustry
};
