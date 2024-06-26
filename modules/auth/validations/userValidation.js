const Joi = require('joi');
let self = {};

/** Create user */
const createUserSchema = Joi.object({
	user_id: Joi.forbidden(),
	user_uuid: Joi.string().uuid().optional(),
	first_name: Joi.string().max(50).required(),
	middle_name: Joi.string().max(50).optional(),
	last_name: Joi.string().max(50).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().allow(null).pattern(/^[0-9]{11}$/).optional(),
	birthdate: Joi.date().iso().optional(),
	address: Joi.string().allow(null).optional(),
	gender: Joi.string().valid('Male', 'Female').optional(),
	is_active: Joi.boolean().required(),
	is_verified: Joi.boolean().required(),
	created_by: Joi.number().integer().optional(),
	updated_by: Joi.number().integer().optional(),
});
self.validateCreateUserSchema = (data) => {
	return createUserSchema.validate(data);
}

/** Update profile */
const updateProfileSchema = Joi.object({
	username: Joi.string().max(50).allow(null).default('').optional(),
	full_name: Joi.string().max(50).allow(null).default('').optional(),
	first_name: Joi.string().max(50).allow(null).default('').optional(),
	middle_name: Joi.string().max(50).allow(null).default('').optional(),
	last_name: Joi.string().max(50).allow(null).default('').optional(),
	nickname: Joi.string().max(50).allow(null).default('').optional(),
	email: Joi.string().email().max(50).allow(null).default('').optional(),
	phone: Joi.string().max(20).allow(null).pattern(/^[0-9]{11}$/).optional(),
	birthdate: Joi.date().iso().optional(),
	address: Joi.string().allow(null).optional(),
	gender: Joi.string().valid('Male', 'Female').optional(),
	extended_info: Joi.object(),
});
self.validateUpdateProfileSchema = (data) => {
	return updateProfileSchema.validate(data);
}

/** Get users */
const getUsersParamsSchema = Joi.object({
	searchKey: Joi.string().allow('').optional(),
	isActive: Joi.boolean().optional()
});
self.validateGetUsersParams = (data) => {
	return getUsersParamsSchema.validate(data);
}

/** Id params */
const idParamSchema = Joi.object({
	id: Joi.number().required()
});
self.validateIdParam = (data) => {
	return idParamSchema.validate(data);
}

module.exports = self;