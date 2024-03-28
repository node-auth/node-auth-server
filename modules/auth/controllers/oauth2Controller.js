const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
/** Services */
const userService = require('../services/userService');
const userAuthService = require('../services/userAuthService');
const userTokenService = require('../services/userTokenService');
const userRoleService = require('../services/userRoleService');
const roleService = require('../services/roleService');
const permissionService = require('../services/permissionService');
const applicationService = require('../services/applicationService');
const callbackUrlService = require('../services/callbackUrlService');
const authorizationCodeService = require('../services/authorizationCodeService');``
const accessTokenService = require('../services/accessTokenService');
const refreshTokenService = require('../services/refreshTokenService');
/** Validations */
const oauth2V1Validation = require('../validations/oauth2V1Validation');
/** Utility */
const {addHours} = require('../../../utils/date-util');
const { generateRandomCode } = require('../../../utils/code-generate-util');
const { encryptSHA256 } = require('../../../utils/encryption-util');
let self = {};

/** Register */
self.register = async (req, res) => {
    try {
        /** Validate inputs */
        const body = req.body;
        const validatedData = oauth2V1Validation.validateRegistrationSchema(body);
        if(validatedData.error) return res.status(400).json({success: false, message: validatedData.error.message });
        /** Validate email */
        const qGetEmail = await userService.getUserByEmail(validatedData.value['email']);
        if(qGetEmail) return res.status(400).json({success: false, message: 'Email already taken' });
        /** Create user */
        const dataToInsert = {...validatedData.value};
        delete dataToInsert.password;
        delete dataToInsert.confirm_password;
        const qCreateUser = await userService.createUser(dataToInsert);
        /** hash password */
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(validatedData.value['password'], salt);
        /** Create user auth */
        const {user_id} = qCreateUser;
        await userAuthService.createUserAuth({user_id, password: hashedPassword});
        /** Create user role */
        const getRegisteredRole = await roleService.getRoleByCode('REG');
        await userRoleService.createUserRole({user_id, role_id: getRegisteredRole['role_id']});
        /** Response */
        res.status(201).json({
            success: true,
            message: 'Success',
            data: dataToInsert
        });
    } catch(err) {
        res.status(500).json({success: false, message: 'An error occured', error: err.message});
    }
}

/** Authorize */
self.authorize = async (req, res) => {
    try {
        const validatedData = oauth2V1Validation.validateAuthorizeSchema(req.query);
        /** Validate query params */
        if(validatedData.error) return res.status(400).json({success: false, message: 'Invalid request' });
        /** Get data */
        const {
            client_id,
            response_type,
            code_challenge,
            code_challenge_method,
            scope,
            redirect_uri,
            state
        } = validatedData.value;
        /** Current date */
        const currentDate = new Date();
        const expirationDate = addHours(currentDate, 1);
        /** Validate client */
        const qResult = await applicationService.getApplicationByClientId(client_id);
        if(!qResult) return res.status(400).json({success: false, message: 'Invalid request'});
        /** Validate domain url */
        const domainId = req.params.domainId;
        const domainToValidate = `${process.env.BASE_URL}/v1/oauth/${domainId}`;
        if(domainToValidate != qResult['domain']) return res.status(400).json({success: false, message: 'Invalid request'});
        /** Validate callback url */
        let isCallbackUrlValid = true;
        if(qResult['application_type'] == 'WEB' || qResult['application_type'] == 'SPA' || qResult['application_type'] == 'NATIVE') {
            const callbackUrls = await callbackUrlService.getAuthCallbackUrlsByApplicationId(qResult['application_id']);
            const callbackIndex = callbackUrls.findIndex(item => item['url'] == redirect_uri);
            if(callbackIndex == -1) {
                isCallbackUrlValid = false;
            }
        }
        if(!isCallbackUrlValid) return res.status(400).json({success: false, message: 'Invalid request'});
        /** Validate scopes */
        const permissionList = await permissionService.getAuthPermissions();
        const scopes = scope.split(" ");
        let isScopeValid = true;
        for(let i = 0; i < scopes.length; i++) {
            const cIndex = permissionList.findIndex(item => item == scopes[i]);
            if(cIndex == -1) { isScopeValid = false; }
        }
        if(!isScopeValid) return res.status(400).json({success: false, message: 'Invalid request'});
        /** Generate code */
        const code = generateRandomCode(50, 100);
        await authorizationCodeService.createAuthorizationCode(
            {
                code,
                client_id,
                redirect_uri,
                scope,
                code_challenge,
                code_challenge_method,
                response_type,
                state,
                expires_at: expirationDate
            }
        );
        /** Response */
        res.status(200).json({
            success: true,
            message: 'Success',
            data: {
                code,
                client_id,
                redirect_uri,
                scope,
                code_challenge,
                code_challenge_method,
                response_type,
                state
            }
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'An error occured', error: err.message});
    }
}

/** Token */
self.token = async (req, res) => {
    try {
        /*************** Input Validation Start ***************/
        /** Validate grant type */
        if(!req.body.grant_type) return res.status(400).json({success: false, message: 'Invalid request' });
        /** Validate query params */
        const validatedData = validateTokenRequestBody(req.body);
        if(validatedData.error) return res.status(400).json({success: false, message: 'Invalid request' });
        /*************** Input Validation End ***************/

        /*************** Get Data Start ***************/
        /** Current date */
        const currentDate = new Date();
        const expirationData = addHours(currentDate, 1);
        /** Get data */
        const grant_type = validatedData.value['grant_type'];
        const code = validatedData.value['code'];
        const client_id = validatedData.value['client_id'];
        const client_secret = validatedData.value['client_secret'];
        const username = validatedData.value['username'];
        const password = validatedData.value['password'];
        const redirect_uri = validatedData.value['redirect_uri'];
        const refresh_token = validatedData.value['refresh_token'];
        const code_verifier = validatedData.value['code_verifier'];
        const scope = validatedData.value['scope'];
        /** Get Application */
        const qApplicationByClientId = await applicationService.getApplicationByClientId(client_id);
        if(!qApplicationByClientId) return res.status(400).json({success: false, message: 'Invalid request'});
        /*************** Get Data End ***************/

        /** Token Payload */
        const ip = req.ip || req.connection.remoteAddress;
        let tokenPayload = {ip, grant_type};
        let generatedRefreshToken;
        let isIncludeRefreshToken = false;
        
        /*************** Validation Start ***************/
        let isValid = true;
        
        /** Authorization code grant */
        if(grant_type == 'authorization_code') {
            /** Get authorization code */
            const qAuthorizationCode = await authorizationCodeService.getAuthorizationCode(code, client_id);
            if(!qAuthorizationCode) return res.status(400).json({success: false, message: 'Invalid request'});
            /** Validate redirect uri */
            if(redirect_uri != qAuthorizationCode['redirect_uri']) isValid = false;
            /** Validate challenge */
            const verifierEncrypted = encryptSHA256(code_verifier);
            if(verifierEncrypted != qAuthorizationCode['code_challenge']) isValid = false;
            /** Validate scope */
            if(scope != qAuthorizationCode['scope']) isValid = false;
            /** Set token payload */
            if(isValid) {
                tokenPayload.user_id = req.user['user_id'];
                tokenPayload.user_uuid = req.user['user_uuid'];
                tokenPayload.email = req.user['email'];
                /** Add permissions to payload */
                const userPermission = await permissionService.getUserPermissions(req.user['user_id']);
                tokenPayload.permissions = userPermission;
                /** Generate refresh token */
                /** Set if include refresh token */
                isIncludeRefreshToken = scope.split(" ").includes('offline_access');
                if(isIncludeRefreshToken) {
                    const refreshToken = generateRandomCode(50, 100);
                    /** Set refresh token value */
                    generatedRefreshToken = refreshToken;
                    /** Save refresh token */
                    await refreshTokenService.createRefreshToken({
                        refresh_token: refreshToken,
                        client_id,
                        user_id: req.user['user_id'],
                        scope: scope,
                        issued_at: currentDate,
                        expires_at: expirationData,
                    });
                }
            }
            /** Delete authorization code */
            await authorizationCodeService.deleteAuthorizationCode(qAuthorizationCode['authorization_code_id']);
        }

        /** Password grant */
        else if(grant_type == 'password') {
            /** Get authorization code */
            const qAuthorizationCode = await authorizationCodeService.getAuthorizationCode(code, client_id);
            if(!qAuthorizationCode) return res.status(400).json({success: false, message: 'Invalid request'});

            /** Get user details */
            const qUserByEmail = await userService.getUserByEmail(username);
            if(!qUserByEmail) return res.status(400).json({success: false, message: 'Invalid request'});
            const qUserAuth = await userAuthService.getUserAuthByUserId(qUserByEmail['user_id']);
            if(!qUserAuth) return res.status(400).json({success: false, message: 'Invalid request'});
            /** Password grant validation */
            const isMatchedPassword = await bcrypt.compare(password, qUserAuth['password']);
            if(!isMatchedPassword) isValid = false;
            /** Validate challenge */
            const verifierEncrypted = encryptSHA256(code_verifier);
            if(verifierEncrypted != qAuthorizationCode['code_challenge']) isValid = false;
            /** Validate scope */
            if(scope != qAuthorizationCode['scope']) isValid = false;
            /** Add token payloads */
            if(isValid) {
                /** Add user to payload */
                tokenPayload.user_id = qUserByEmail['user_id'];
                tokenPayload.user_uuid = qUserByEmail['user_uuid'];
                tokenPayload.email = qUserByEmail['email'];
                /** Add permissions to payload */
                const userPermission = await permissionService.getUserPermissions(qUserByEmail['user_id']);
                tokenPayload.permissions = userPermission;
                /** Generate refresh token */
                /** Set if include refresh token */
                isIncludeRefreshToken = scope.split(" ").includes('offline_access');
                if(isIncludeRefreshToken) {
                    const refreshToken = generateRandomCode(50, 100);
                    /** Set refresh token value */
                    generatedRefreshToken = refreshToken;
                    /** Save refresh token */
                    await refreshTokenService.createRefreshToken({
                        refresh_token: generatedRefreshToken,
                        client_id,
                        user_id: qUserByEmail['user_id'],
                        scope: scope,
                        issued_at: currentDate,
                        expires_at: expirationData,
                    });
                }
            }
            /** Delete authorization code */
            await authorizationCodeService.deleteAuthorizationCode(qAuthorizationCode['authorization_code_id']);
        }

        /** Client credentials grant */
        else if(grant_type == 'client_credentials') {
            /** Validate client secret */
            if(client_secret != qApplicationByClientId['client_secret']) isValid = false;
            if(isValid) {
                /** Add permissions to payload */
                const applicationPermission = await permissionService.getApplicationPermissions(qApplicationByClientId['client_id'], qApplicationByClientId['client_secret']);
                tokenPayload.permissions = applicationPermission;
            }
        }

        /** Refresh token grant */
        else if(grant_type == 'refresh_token') {
            /** Validate client secret */
            if(client_secret) {
                if(client_secret != qApplicationByClientId['client_secret']) isValid = false;
            }
            if(isValid) {
                /** Validate refresh token */
                const getRefreshToken = await refreshTokenService.getRefreshTokenByToken(refresh_token);
                if(!getRefreshToken) return res.status(400).json({success: false, message: 'Invalid request'});
                /** Get user info */
                const qUserById = await userService.getUserById(getRefreshToken['user_id']);
                if(!qUserById) return res.status(400).json({success: false, message: 'Invalid request'});
                /** Add user to payload */
                tokenPayload.user_id = qUserById['user_id'];
                tokenPayload.user_uuid = qUserById['user_uuid'];
                tokenPayload.email = qUserById['email'];
                /** Add permissions to payload */
                const userPermission = await permissionService.getUserPermissions(qUserById['user_id']);
                tokenPayload.permissions = userPermission;
                /** Add refresh token */
                isIncludeRefreshToken = true;
                generatedRefreshToken = refresh_token;
            }
        }

        /** Validate */
        if(!isValid) return res.status(400).json({success: false, message: 'Invalid request'});
        /*************** Validation End ***************/

        /*************** Token Generation Start ***************/
        const token = jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, {
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
            expiresIn: '1h',
            algorithm: 'RS256'
        });
        /** Save token */
        await accessTokenService.createAccessToken({
            access_token: token,
            client_id,
            user_id: tokenPayload.user_id,
            scope: scope,
            issued_at: currentDate,
            expires_at: expirationData,
        });
        /*************** Token Generation End ***************/

        /*************** Generate response ***************/
        let responseData = {
            access_token: token,
            iat: currentDate,
            exp: expirationData,
            refresh_token: generatedRefreshToken
        };
        if(!isIncludeRefreshToken) { delete responseData.refresh_token; }
        res.status(200).json({
            success: true,
            message: 'Success',
            data: responseData
        });
    } catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: 'An error occured', error: err.message});
    }
}

/** Validate token */
const validateTokenRequestBody = (reqData) => {
    let validatedData;
    if(reqData.grant_type == 'authorization_code') validatedData = oauth2V1Validation.validateAuthorizationCodeGrantSchema(reqData);
    else if(reqData.grant_type == 'password') validatedData = oauth2V1Validation.validatePasswordGrantSchema(reqData);
    else if(reqData.grant_type == 'client_credentials') validatedData = oauth2V1Validation.validateClientCredentialGrantSchema(reqData);
    else if(reqData.grant_type == 'refresh_token') validatedData = oauth2V1Validation.validateRefreshTokenGrantSchema(reqData);
    else validatedData.error = {message: 'Invalid request'};
    return validatedData;
}

/** Revoke */
self.revoke = async (req, res) => {
    try {
        /** Validate inputs */
        const validatedData = oauth2V1Validation.validateRevokeTokenSchema(req.body);
        if(validatedData.error) return res.status(400).json({success: false, message: validatedData.error.message });
        /** Remove */
        if(validatedData.value['type'] == 'access_token') {
            /** Get token */
            const getToken = await accessTokenService.getAccessTokenByToken(validatedData.value['token']);
            /** Delete token */
            await accessTokenService.deleteAccessTokenById(getToken['access_token_id']);
        }
        else if(validatedData.value['type'] == 'refresh_token') {
            /** Get token */
            const getToken = await refreshTokenService.getRefreshTokenByToken(validatedData.value['token']);
            /** Delete token */
            await refreshTokenService.deleteRefreshTokenById(getToken['refresh_token_id']);
        }
        res.status(200).json({success: true, message: 'Token revoked'});
    } catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: 'An error occured', error: err.message});
    }
}

/** userinfo */
self.userinfo = async (req, res) => {
    try {
        const qUserIndo = await userService.getUserById(req.user['user_id']);
        const responseData = {
            user_id: qUserIndo['user_id'],
            user_uuid: qUserIndo['user_uuid'],
            username: qUserIndo['username'],
            first_name: qUserIndo['first_name'],
            middle_name: qUserIndo['middle_name'],
            last_name: qUserIndo['last_name'],
            nickname: qUserIndo['nickname'],
            email: qUserIndo['email'],
            phone: qUserIndo['phone'],
            birthdate: qUserIndo['birthdate'],
            address: qUserIndo['address'],
            gender: qUserIndo['gender'],
            extended_info: qUserIndo['extended_info']
        }
        res.status(200).json({success: true, message: 'Success', data: responseData});
    } catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: 'An error occured', error: err.message});
    }
}

/** Introspect */
self.introspect = async (req, res) => {
    try {
        /** Validate inputs */
        console.log("Received");
        const validatedData = oauth2V1Validation.validateIntrospectSchema(req.body);
        if(validatedData.error) return res.status(400).json({success: false, message: validatedData.error.message });
        /** Get application */
        const qApplication = await applicationService.getApplicationByClientId(validatedData.value['client_id']);
        if(!qApplication) return res.status(400).json({success: false, message: 'Invalid request'});
        if(qApplication['client_secret'] != validatedData.value['client_secret']) return res.status(400).json({success: false, message: 'Invalid request'});
        /** Get token */
        const getToken = await accessTokenService.getAccessTokenByToken(validatedData.value['token']);
        if(!getToken) return res.status(400).json({success: false, message: 'Invalid request'});
        /** Get token data */
        const decoded = await jwt.verify(validatedData.value['token'], process.env.JWT_PUBLIC_KEY);
        if(decoded.aud != process.env.JWT_AUDIENCE) return res.status(401).json({ error: 'Invalid request' });
        if(decoded.iss != process.env.JWT_ISSUER) return res.status(401).json({ error: 'Invalid request' });
        const responseData = {
            client_id: qApplication['client_id'],
            client_secret: qApplication['client_secret'],
            ...decoded
        }
        res.status(200).json({success: true, message: 'Success', data: responseData});
    } catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: 'An error occured', error: err.message});
    }
}

module.exports = self;