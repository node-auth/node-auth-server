const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
/** Services */
const userService = require('../services/userService');
const userAuthService = require('../services/userAuthService');
const userTokenService = require('../services/userTokenService');
const userRoleService = require('../services/userRoleService');
const roleService = require('../services/roleService');
const permissionService = require('../services/permissionService');
const accessTokenService = require('../services/accessTokenService');
const refreshTokenService = require('../services/refreshTokenService');
/** Validations */
const authValidation = require('../validations/authValidation');
/** Utility */
const { addHours } = require('../../../utils/date-util');
const { generateRandomCode, generateTOTP, verifyOTP, generateRandomCode6 } = require('../../../utils/code-generate-util');
const { encryptSHA256 } = require('../../../utils/encryption-util');
const { sendEmail } = require('../../../services/email_service');
const { sendSMS } = require('../../../services/sms_service');

let self = {};

/** Register */
self.register = async (req, res) => {
	try {
		/** Validate inputs */
		const body = req.body;
		const validatedData = authValidation.validateRegistrationSchema(body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Validate email and phone */
		if (validatedData.value['email'] == null && validatedData.value['phone'] == null) {
			return res.status(400).json({ success: false, message: "Email and phone is null" });
		}
		/** Validate email */
		const isEmailAlreadyExist = false;
		if (validatedData.value['email'] != null) {
			const qGetEmail = await userService.getUserByEmail(validatedData.value['email']);
			if (qGetEmail) isEmailAlreadyExist = true;
		}
		if (isEmailAlreadyExist) return res.status(400).json({ success: false, message: 'Email already taken' });
		/** Validate phone */
		const isPhoneAlreadyExist = false;
		if (validatedData.value['phone'] != null) {
			const qGetPhone = await userService.getUserByPhone(validatedData.value['phone']);
			if (qGetPhone) isPhoneAlreadyExist = true;
		}
		if (isPhoneAlreadyExist) return res.status(400).json({ success: false, message: 'Phone already taken' });
		/** Add default values */
		const randCode = generateRandomCode6();
		if (validatedData.value['username'] == null) {
			validatedData.value['username'] = 'user' + randCode;
		}
		if (validatedData.value['full_name'] == null) {
			validatedData.value['full_name'] = 'user' + randCode;
		}
		/** Create user */
		const dataToInsert = { ...validatedData.value };
		delete dataToInsert.password;
		delete dataToInsert.confirm_password;
		const qCreateUser = await userService.createUser(dataToInsert);
		/** hash password */
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(validatedData.value['password'], salt);
		/** Create user auth */
		const { user_id } = qCreateUser;
		await userAuthService.createUserAuth({ user_id, password: hashedPassword });
		/** Create user role */
		const getRegisteredRole = await roleService.getRoleByCode('REG');
		await userRoleService.createUserRole({ user_id, role_id: getRegisteredRole['role_id'] });
		/** Response */
		/** Current date */
		const currentDate = new Date();
		const expirationDate = addHours(currentDate, 1);
		/** Get user by email */
		const qUserById = await userService.getUserById(qCreateUser['user_id']);
		/** Add permissions to payload */
		const userPermission = await permissionService.getUserPermissions(qUserById['user_id']);
		/** Generate refresh token */
		const refreshToken = generateRandomCode(50, 100);
		/** Save refresh token */
		await refreshTokenService.createRefreshToken({
			refresh_token: refreshToken,
			client_id: "",
			user_id: qUserById['user_id'],
			scope: "openid profile email phone address offline_access",
			issued_at: currentDate,
			expires_at: expirationDate,
		});
		/** Generate token */
		const ip = req.ip || req.connection.remoteAddress;
		let tokenPayload = {
			ip,
			user_id: qUserById['user_id'],
			user_uuid: qUserById['user_uuid'],
			email: qUserById['email'],
			permissions: userPermission,
			metadata: qUserById['metadata']
		};
		const token = jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, {
			audience: req.headers['user-agent'] ?? process.env.JWT_AUDIENCE,
			issuer: process.env.JWT_ISSUER,
			expiresIn: '1h',
			algorithm: 'RS256'
		});
		/** Save token */
		await accessTokenService.createAccessToken({
			access_token: token,
			client_id: "",
			user_id: qUserById['user_id'],
			scope: "openid profile email phone address offline_access",
			issued_at: currentDate,
			expires_at: expirationDate,
		});
		/** Generate response */
		let responseData = {
			access_token: token,
			iat: currentDate,
			exp: expirationDate,
			refresh_token: refreshToken
		};
		res.status(200).json({
			success: true,
			message: 'Success',
			data: responseData
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Login */
self.login = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateLoginSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Current date */
		const currentDate = new Date();
		const expirationDate = addHours(currentDate, 1);
		/** Get user by email */
		const qUserByEmail = await userService.getUserByLoginUsername(validatedData.value['username']);
		if (!qUserByEmail) return res.status(400).json({ success: false, message: 'Invalid credentials' });
		/** Get password */
		const qUserAuth = await userAuthService.getUserAuthByUserId(qUserByEmail['user_id']);
		if (!qUserAuth) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Validate password */
		const isMatchedPassword = await bcrypt.compare(validatedData.value['password'], qUserAuth['password']);
		if (!isMatchedPassword) return res.status(400).json({ success: false, message: 'Invalid credentials' });
		/** Add permissions to payload */
		const userPermission = await permissionService.getUserPermissions(qUserByEmail['user_id']);
		/** Generate refresh token */
		const refreshToken = generateRandomCode(50, 100);
		/** Save refresh token */
		await refreshTokenService.createRefreshToken({
			refresh_token: refreshToken,
			client_id: "",
			user_id: qUserByEmail['user_id'],
			scope: "openid profile email phone address offline_access",
			issued_at: currentDate,
			expires_at: expirationDate,
		});
		/** Generate token */
		const ip = req.ip || req.connection.remoteAddress;
		let tokenPayload = {
			ip,
			user_id: qUserByEmail['user_id'],
			user_uuid: qUserByEmail['user_uuid'],
			email: qUserByEmail['email'],
			permissions: userPermission,
			metadata: qUserByEmail['metadata']
		};
		const token = jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, {
			audience: req.headers['user-agent'] ?? process.env.JWT_AUDIENCE,
			issuer: process.env.JWT_ISSUER,
			expiresIn: '1h',
			algorithm: 'RS256'
		});
		/** Save token */
		await accessTokenService.createAccessToken({
			access_token: token,
			client_id: "",
			user_id: qUserByEmail['user_id'],
			scope: "openid profile email phone address offline_access",
			issued_at: currentDate,
			expires_at: expirationDate,
		});
		/** Generate response */
		let responseData = {
			access_token: token,
			iat: currentDate,
			exp: expirationDate,
			refresh_token: refreshToken
		};
		res.status(200).json({
			success: true,
			message: 'Success',
			data: responseData
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Logout */
self.logout = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateRefreshTokenSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Delete access token */
		if (validatedData.value['access_token']) {
			const qAccessToken = await accessTokenService.getAccessTokenByToken(validatedData.value['access_token']);
			if (!qAccessToken) return res.status(400).json({ success: false, message: 'Invalid access token' });
			await accessTokenService.deleteAccessTokenById(qAccessToken['access_token_id']);
		}
		/** Delete refresh token */
		if (validatedData.value['refresh_token']) {
			const qRefresbToken = await refreshTokenService.getRefreshTokenByToken(validatedData.value['refresh_token']);
			if (!qRefresbToken) return res.status(400).json({ success: false, message: 'Invalid refresh token' });
			await refreshTokenService.deleteRefreshTokenById(qRefresbToken['refresh_token_id']);
		}
		/** Response */
		res.status(200).json({
			success: true,
			message: 'Success'
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Refresh */
self.refresh = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateRefreshTokenSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Current date */
		const currentDate = new Date();
		const expirationDate = addHours(currentDate, 1);
		/** Validate refresh token */
		const getRefreshToken = await refreshTokenService.getRefreshTokenByToken(validatedData.value['refresh_token']);
		if (!getRefreshToken) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Get user info */
		const qUserById = await userService.getUserById(getRefreshToken['user_id']);
		if (!qUserById) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Add permissions to payload */
		const userPermission = await permissionService.getUserPermissions(qUserById['user_id']);
		/** Generate token */
		const ip = req.ip || req.connection.remoteAddress;
		let tokenPayload = {
			ip,
			user_id: qUserById['user_id'],
			user_uuid: qUserById['user_uuid'],
			email: qUserById['email'],
			permissions: userPermission,
			metadata: qUserById['metadata']
		};
		const token = jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, {
			audience: req.headers['user-agent'] ?? process.env.JWT_AUDIENCE,
			issuer: process.env.JWT_ISSUER,
			expiresIn: '1h',
			algorithm: 'RS256'
		});
		/** Generate response */
		let responseData = {
			access_token: token,
			iat: currentDate,
			exp: expirationDate,
			refresh_token: validatedData.value['refresh_token']
		};
		res.status(200).json({
			success: true,
			message: 'Success',
			data: responseData
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Send email verification */
self.sendEmailVerification = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateEmailVerificationSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Generate otp */
		const otp = generateTOTP(process.env.OTP_SECRET);
		/** Send email logic */
		const email = validatedData.value['email'];
		const sendRes = await sendEmail(email, 'Verify Email', 'Here is your verification code', '</br><b>' + otp + '</b>')
		/** Response */
		if (sendRes.success) {
			res.status(200).json({
				success: true,
				message: 'Success',
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Email error'
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Send phone verification */
self.sendPhoneVerification = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validatePhoneVerificationSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Generate otp */
		const otp = generateTOTP(process.env.OTP_SECRET);
		/** Send SMS logic */
		const sendRes = await sendSMS(validatedData.value['phone'], otp);
		/** Response */
		if (sendRes.success) {
			res.status(200).json({
				success: true,
				message: 'Success'
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Sms error'
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Verify email */
self.verifyEmail = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateVerifyEmailSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Validate otp */
		const isVerified = verifyOTP(process.env.OTP_SECRET, validatedData.value['otp']);
		if (!isVerified) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Get user and update status */
		const qUser = await userService.getUserByEmail(validatedData.value['email']);
		if (qUser) {
			/** Update email status */
			await userService.verifyUserEmail(qUser['user_id']);
		}
		/** signed verification */
		const email_verification_token = encryptSHA256(validatedData.value['email'])
		res.status(200).json({
			success: true,
			message: 'Success',
			data: {
				email_verification_token
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Verify phone */
self.verifyPhone = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateVerifyPhoneSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Validate otp */
		const isVerified = verifyOTP(process.env.OTP_SECRET, validatedData.value['otp']);
		if (!isVerified) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Get user */
		const qUser = await userService.getUserByPhone(validatedData.value['phone']);
		if (qUser) {
			/** Update phone status */
			await userService.verifyUserPhone(qUser['user_id']);
		}
		/** signed verification */
		const phone_verification_token = encryptSHA256(validatedData.value['phone'])
		res.status(200).json({
			success: true,
			message: 'Success',
			data: {
				phone_verification_token
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Forgot password */
self.forgotPassword = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateForgotPasswordSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Generate OTP */
		const otp = generateTOTP(process.env.OTP_SECRET);
		/** Send SMS/Email logic */

		/** Validate email */
		const qEmail = await userService.getUserByEmail(validatedData.value['email']);
		if (!qEmail) return res.status(400).json({ success: false, message: 'Invalid request' });
		await userTokenService.createUserToken({
			name: "PR",
			value: validatedData.value['email'],
			status: "VERIFIED",
			user_id: qEmail['user_id']
		});
		/** Response */
		res.status(200).json({
			success: true,
			message: 'Success',
			data: { otp }
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Reset password */
self.resetPassword = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateResetPasswordSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Validate email */
		const qEmail = await userService.getUserByEmail(validatedData.value['email']);
		if (!qEmail) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Validate reset token */
		const qResetToken = await userTokenService.getUserTokenByNameAndValue('PR', validatedData.value['email']);
		if (!qResetToken) return res.status(400).json({ success: false, message: 'Invalid request' });
		await userTokenService.deleteUserTokenById(qResetToken['user_token_id']);
		/** Validate otp */
		const isVerified = verifyOTP(process.env.OTP_SECRET, validatedData.value['otp']);
		if (!isVerified) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Create reset token */
		const resetToken = generateRandomCode(50, 90);
		await userTokenService.createUserToken({
			name: "RT",
			value: resetToken,
			status: "PENDING",
			user_id: qEmail['user_id']
		});
		/** Response */
		res.status(200).json({
			success: true,
			message: 'Success',
			data: {
				reset_token: resetToken
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Change password */
self.changePassword = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = authValidation.validateChangePasswordSchema(req.body);
		if (validatedData.error) return res.status(400).json({ success: false, message: validatedData.error.message });
		/** Validate reset token */
		const qResetToken = await userTokenService.getUserTokenByNameAndValue('RT', validatedData.value['reset_token']);
		if (!qResetToken) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Get user auth */
		const qUserAuthById = await userAuthService.getUserAuthByUserId(qResetToken['user_id']);
		if (!qUserAuthById) return res.status(400).json({ success: false, message: 'Invalid request' });
		/** Update user password */
		/** hash password */
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(validatedData.value['password'], salt);
		await userAuthService.changeUserPassword(qUserAuthById['user_auth_id'], hashedPassword);
		/** Response */
		res.status(200).json({
			success: true,
			message: 'Success'
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Profile */
self.userinfo = async (req, res) => {
	try {
		const qUserIndo = await userService.getUserById(req.user['user_id']);
		const responseData = qUserIndo;
		res.status(200).json({ success: true, message: 'Success', data: responseData });
	} catch (err) {
		console.log(err)
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

module.exports = self;