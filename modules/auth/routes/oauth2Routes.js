const express = require('express');
const router = express.Router();
const {validatePermission} = require('../../../middlewares/authentication/validatePermission.middleware');
const {oauth2Middleware} = require('../../../middlewares/authentication/oauth2.middleware');
const {checkSettings} = require('../../../middlewares/settings/checkSettings.middleware');
const {validateToken}  = require('../../../middlewares/authentication/validateToken.middleware');
const oauth2Controller = require('../controllers/oauth2Controller');

/** CSRF Options */
const { generateToken } = require('../../../utils/csrf-util');

router.post('/:domainId/o/register', checkSettings(['OAUTH_V1_REGISTER_ENABLED']), oauth2Controller.register);
router.get('/:domainId/o/authorize', checkSettings(['OAUTH_V1_AUTHORIZE_GET_ENABLED']), oauth2Controller.authorize);
router.post('/:domainId/o/token', checkSettings(['OAUTH_V1_TOKEN_ENABLED']), oauth2Middleware('token'), oauth2Controller.token);
router.post('/:domainId/o/revoke', checkSettings(['OAUTH_V1_REVOKE_ENABLED']), oauth2Controller.revoke);
router.post('/:domainId/o/instrospect', checkSettings(['OAUTH_V1_INTROSPECT_ENABLED']), oauth2Controller.introspect);
router.get('/:domainId/o/userinfo', checkSettings(['OAUTH_V1_USERINFO_ENABLED']), validateToken,  validatePermission(['profile']), oauth2Controller.userinfo);
router.get('/:domainId/o/csrf-token', (req, res) => {
    const csrfToken = generateToken(process.env.CSRF_SECRET);
    res.json({ csrfToken });
});

module.exports = router;