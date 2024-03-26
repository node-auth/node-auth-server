const Joi = require('joi');
let self = {};

/** Registration */
const passwordSchema = Joi.string()
    .min(8)
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
    .required();
const registrationSchema = Joi.object({
    username: Joi.string().required(),
    first_name: Joi.string().required(),
    middle_name: Joi.string().optional(),
    last_name: Joi.string().required(),
    nickname: Joi.string().optional(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    birthdate: Joi.date().iso().optional(),
    address: Joi.string().allow(null).optional(),
    gender: Joi.string().valid('Male', 'Female').optional(),
    extended_info: Joi.object().optional(),
    password: passwordSchema,
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
});
self.validateRegistrationSchema = (data) => {
    return registrationSchema.validate(data);
}

/** Authorize */
/**
 * code - authorization code grant
 * token - implicit grant (we will not support implicit grant due to security vulnerability)
 * id_token - openid connect
 */
const authorizeSchema = Joi.object({
    client_id: Joi.string().required(),
    response_type: Joi.string().valid('code', 'id_token').required(),
    code_challenge: Joi.string().required(),
    code_challenge_method: Joi.string().valid('S256').required(),
    scope: Joi.string().required(),
    redirect_uri: Joi.string().optional().default(''),
    state: Joi.string().optional().default('')
});
self.validateAuthorizeSchema = (data) => {
    return authorizeSchema.validate(data);
}

/** Authorization code grant - all type of application except machine to machine */
const authorizationCodeGrantSchema = Joi.object({
    grant_type: Joi.string().valid('authorization_code').required(),
    code: Joi.string().required(),
    client_id: Joi.string().required(),
    redirect_uri: Joi.string().required(),
    code_verifier: Joi.string().required(),
    scope: Joi.string().required(),
});
self.validateAuthorizationCodeGrantSchema = (data) => {
    return authorizationCodeGrantSchema.validate(data);
}

/** Password grant - single page application or mobile */
const passwordGrantSchema = Joi.object({
    grant_type: Joi.string().valid('password').required(),
    code: Joi.string().optional().default(''),
    client_id: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    code_verifier: Joi.string().required(),
    scope: Joi.string().required(),
});
self.validatePasswordGrantSchema = (data) => {
    return passwordGrantSchema.validate(data);
}

/** Client credential grant - machine to machine (no user involvement) */
const clientCredentialGrantSchema = Joi.object({
    grant_type: Joi.string().valid('client_credentials').required(),
    client_id: Joi.string().required(),
    client_secret: Joi.string().required(),
});
self.validateClientCredentialGrantSchema = (data) => {
    return clientCredentialGrantSchema.validate(data);
}

/** Refresh token grant */
const refreshTokenGrantSchema = Joi.object({
    grant_type: Joi.string().valid('refresh_token').required(),
    client_id: Joi.string().required(),
    client_secret: Joi.string().optional(),
    refresh_token: Joi.string().required()
});
self.validateRefreshTokenGrantSchema = (data) => {
    return refreshTokenGrantSchema.validate(data);
}

/** Revoke token */
const revokeTokenSchema = Joi.object({
    token: Joi.string().required(),
    type: Joi.string().valid('access_token', 'refresh_token').required(),
});
self.validateRevokeTokenSchema = (data) => {
    return revokeTokenSchema.validate(data);
}

/** Introspect token */
const introspectSchema = Joi.object({
    client_id: Joi.string().required(),
    client_secret: Joi.string().required(),
    token: Joi.string().required()
});
self.validateIntrospectSchema = (data) => {
    return introspectSchema.validate(data);
}

module.exports = self;