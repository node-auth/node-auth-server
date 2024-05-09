const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { validatePermission } = require('../../../middlewares/authentication/validatePermission.middleware');
const { validateToken } = require('../../../middlewares/authentication/validateToken.middleware');

router.post('/', validateToken, validatePermission(['profile']), profileController.updateProfile);

module.exports = router;