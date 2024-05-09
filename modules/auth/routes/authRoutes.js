const express = require('express');
const router = express.Router();
const { validatePermission } = require('../../../middlewares/authentication/validatePermission.middleware');
const { checkSettings } = require('../../../middlewares/settings/checkSettings.middleware');
const { validateToken } = require('../../../middlewares/authentication/validateToken.middleware');
const authController = require('../controllers/authController');

router.post('/register', checkSettings(['AUTH_REGISTER_ENABLED']), authController.register);
router.post('/login', checkSettings(['AUTH_LOGIN_ENABLED']), authController.login);
router.post('/logout', checkSettings(['AUTH_LOGOUT_ENABLED']), authController.logout);
router.post('/refresh', checkSettings(['AUTH_REFRESH_ENABLED']), authController.refresh);
router.post('/sendEmailVerification', checkSettings(['AUTH_VERIFY_EMAIL_ENABLED']), authController.sendEmailVerification);
router.post('/sendPhoneVerification', checkSettings(['AUTH_VERIFY_PHONE_ENABLED']), authController.sendPhoneVerification);
router.post('/verifyEmail', checkSettings(['AUTH_VERIFY_EMAIL_ENABLED']), authController.verifyEmail);
router.post('/verifyPhone', checkSettings(['AUTH_VERIFY_PHONE_ENABLED']), authController.verifyPhone);
router.post('/forgotPassword', checkSettings(['AUTH_FORGOT_PASSWORD_ENABLED']), authController.forgotPassword);
router.post('/resetPassword', checkSettings(['AUTH_RESET_PASSWORD_ENABLED']), authController.resetPassword);
router.post('/changePassword', checkSettings(['AUTH_CHANGE_PASSWORD_ENABLED']), authController.changePassword);
router.get('/userinfo', checkSettings(['AUTH_PROFILE_ENABLED']), validateToken, validatePermission(['profile']), authController.userinfo);

module.exports = router;