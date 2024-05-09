const userService = require('../services/userService');
const userValidation = require('../validations/userValidation');
let self = {};

/** Create user */
self.createUser = async (req, res) => {
	try {
		/** Validate inputs */
		const body = req.body;
		const validatedData = userValidation.validateCreateUserSchema(body);
		if (validatedData.error) return res.status(500).json({ message: validatedData.error.message });
		/** Query */
		const qResult = await userService.createUser(validatedData.value);
		res.status(201).json({
			success: true,
			message: 'Success',
			data: qResult
		});
	} catch (err) {
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Get users */
self.getUsers = async (req, res) => {
	try {
		/** Validate inputs */
		const queryParams = req.query;
		const validatedData = userValidation.validateGetUsersParams(queryParams);
		if (validatedData.error) return res.status(500).json({ message: validatedData.error.message });
		/** Query */
		const qResult = await userService.getUsers(validatedData.value['searchKey'], validatedData.value['isActive']);
		res.status(200).json({
			success: true,
			message: 'Success',
			data: qResult
		});
	} catch (err) {
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Get user by id */
self.getUserById = async (req, res) => {
	try {
		/** Validate inputs */
		const params = req.params;
		const validatedData = userValidation.validateIdParam(params);
		if (validatedData.error) return res.status(500).json({ message: validatedData.error.message });
		/** Query */
		const qResult = await userService.getUserById(validatedData.value['id']);
		if (qResult) {
			return res.status(200).json({
				success: true,
				message: 'Success',
				data: qResult
			});
		} else {
			return res.status(404).json({
				success: false,
				message: 'Not found'
			});
		}
	} catch (err) {
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

/** Delete user by id */
self.deleteUserById = async (req, res) => {
	try {
		/** Validate inputs */
		const params = req.params;
		const validatedData = userValidation.validateIdParam(params);
		if (validatedData.error) return res.status(500).json({ message: validatedData.error.message });
		/** Query */
		const qResult = await userService.deleteUserById(validatedData.value['id']);
		if (qResult === 1) {
			return res.status(200).json({ success: true, message: 'Success' });
		} else {
			return res.status(400).json({ success: false, message: 'Invalid input' });
		}
	} catch (err) {
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

module.exports = self;