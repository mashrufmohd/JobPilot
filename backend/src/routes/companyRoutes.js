const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { 
  companyValidation,
  idValidation,
  validate 
} = require('../utils/validators');


router.post(
  '/',
  authenticate,
  companyValidation,
  validate,
  companyController.createCompany
);


router.get(
  '/my-profile',
  authenticate,
  companyController.getMyCompany
);


router.get(
  '/search',
  optionalAuth,
  companyController.searchCompanies
);


router.get(
  '/industry/:industry',
  optionalAuth,
  companyController.getCompaniesByIndustry
);


router.get(
  '/:id',
  idValidation,
  validate,
  optionalAuth,
  companyController.getCompanyById
);


router.put(
  '/:id',
  authenticate,
  idValidation,
  validate,
  companyValidation,
  validate,
  companyController.updateCompany
);


router.delete(
  '/:id',
  authenticate,
  idValidation,
  validate,
  companyController.deleteCompany
);


router.get(
  '/',
  optionalAuth,
  companyController.getAllCompanies
);

module.exports = router;
