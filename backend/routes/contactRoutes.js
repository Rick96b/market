const express = require('express');
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', contactController.createContactRequest);
router.get('/', authMiddleware, adminMiddleware, contactController.getContactRequests);

module.exports = router;
