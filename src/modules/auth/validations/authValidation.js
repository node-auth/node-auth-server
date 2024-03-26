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

/** Login */
const loginSchema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().required()
});
self.validateLoginSchema = (data) => {
    return loginSchema.validate(data);
}

/** Verify email */
const verifyEmail = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
});
self.validateVerifyEmailSchema = (data) => {
    return verifyEmail.validate(data);
}

/** Verify phone */
const verifyPhone = Joi.object({
    phone: Joi.string().required(),
    otp: Joi.string().required(),
});
self.validateVerifyPhoneSchema = (data) => {
    return verifyPhone.validate(data);
}

/** Refresh token */
const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required()
});
self.validateRefreshTokenSchema = (data) => {
    return refreshTokenSchema.validate(data);
}

/** Logout */
const logoutSchema = Joi.object({
    access_token: Joi.string().optional(),
    refresh_token: Joi.string().optional()
});
self.validateAccessTokenSchema = (data) => {
    return logoutSchema.validate(data);
}

/** Forgot password */
const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});
self.validateForgotPasswordSchema = (data) => {
    return forgotPasswordSchema.validate(data);
}

/** Reset password */
const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required()
});
self.validateResetPasswordSchema = (data) => {
    return resetPasswordSchema.validate(data);
}

/** Change password */
const changePasswordSchema = Joi.object({
    reset_token: Joi.string().required(),
    password: passwordSchema,
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
});
self.validateChangePasswordSchema = (data) => {
    return changePasswordSchema.validate(data);
}

module.exports = self;