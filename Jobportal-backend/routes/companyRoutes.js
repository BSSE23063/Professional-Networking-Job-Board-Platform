const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerCompany, getCompanies ,getCompanyById } = require('../controllers/companyController');

router.post('/', protect, registerCompany);
router.get('/', getCompanies);
router.get('/:id', getCompanyById);

module.exports = router;