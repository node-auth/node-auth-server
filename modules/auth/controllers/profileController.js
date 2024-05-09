const userService = require('../services/userService');
const userValidation = require('../validations/userValidation');
let self = {};

/** Update profile */
self.updateProfile = async (req, res) => {
	try {
		/** Validate inputs */
		const validatedData = userValidation.validateUpdateProfileSchema(req.body);
		if (validatedData.error) return res.status(500).json({ message: validatedData.error.message });
		/** Get previous data */
		const userDetails = await userService.getUserById(req.user['user_id']);
		validatedData.value['username'] = validatedData.value['username'] == '' ? userDetails['username'] : validatedData.value['username'];
		validatedData.value['first_name'] = validatedData.value['first_name'] == '' ? userDetails['first_name'] : validatedData.value['first_name'];
		validatedData.value['middle_name'] = validatedData.value['middle_name'] == '' ? userDetails['middle_name'] : validatedData.value['middle_name'];
		validatedData.value['last_name'] = validatedData.value['last_name'] == '' ? userDetails['last_name'] : validatedData.value['last_name'];
		validatedData.value['nickname'] = validatedData.value['nickname'] == '' ? userDetails['nickname'] : validatedData.value['nickname'];
		validatedData.value['phone'] = validatedData.value['phone'] == '' ? userDetails['phone'] : validatedData.value['phone'];
		validatedData.value['email'] = validatedData.value['email'] == '' ? userDetails['email'] : validatedData.value['email'];
		validatedData.value['gender'] = validatedData.value['gender'] == '' ? userDetails['gender'] : validatedData.value['gender'];
		validatedData.value['extended_info']['profile_url'] = validatedData.value['extended_info']['profile_url'] == '' ? userDetails['extended_info']['profile_url'] : validatedData.value['extended_info']['profile_url'];
		validatedData.value['extended_info']['civil_status'] = validatedData.value['extended_info']['civil_status'] == '' ? userDetails['extended_info']['civil_status'] : validatedData.value['extended_info']['civil_status'];
		validatedData.value['extended_info']['profession'] = validatedData.value['extended_info']['profession'] == '' ? userDetails['extended_info']['profession'] : validatedData.value['extended_info']['profession'];
		validatedData.value['extended_info']['country'] = validatedData.value['extended_info']['country'] == '' ? userDetails['extended_info']['country'] : validatedData.value['extended_info']['country'];
		validatedData.value['extended_info']['province'] = validatedData.value['extended_info']['province'] == '' ? userDetails['extended_info']['province'] : validatedData.value['extended_info']['province'];
		validatedData.value['extended_info']['city'] = validatedData.value['extended_info']['city'] == '' ? userDetails['extended_info']['city'] : validatedData.value['extended_info']['city'];
		/** User details */
		validatedData.value['metadata'] = {
			version: req.user['metadata']['version'] + 1
		}
		validatedData.value['user_id'] = req.user['user_id'];
		/** Query */
		await userService.updateUser(validatedData.value);
		res.status(200).json({
			success: true,
			message: 'Success'
		});
	} catch (err) {
		res.status(500).json({ success: false, message: 'An error occured', error: err.message });
	}
}

module.exports = self;