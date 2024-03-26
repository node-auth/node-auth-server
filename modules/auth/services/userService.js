const { Op } = require('sequelize');
const { User } = require('../../../models');
let self = {};

/** Create user */
self.createUser = async (userData) => {
    try {
        return await User.create(userData);
    } catch(err) {
        throw err;
    }
}

/** Update user */
self.updateUser = async (data) => {
    try {
        return await User.update(
            data,
            { where: { user_id: data['user_id'] }}
        );
    } catch(err) {
        throw err;
    }
}

/** Get users */
self.getUsers = async (searchKey = '', isActive) => {
    try {
        return await User.findAll({
            where: {
                [Op.and]: [
                    {
                        first_name: {
                            [Op.like]: `%${searchKey}%`
                        },
                        middle_name: {
                            [Op.like]: `%${searchKey}%`
                        },
                        last_name: {
                            [Op.like]: `%${searchKey}%`
                        },
                        email: {
                            [Op.like]: `%${searchKey}%`
                        }
                    },
                    isActive == null ? {} : {is_active: isActive}
                ]
            },
        });
    } catch(err) {
        throw err;
    }
}

/** Get user by id */
self.getUserById = async (id) => {
    try {
        return await User.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get user by email */
self.getUserByEmail = async (email) => {
    try {
        return await User.findOne({where: { email }});
    } catch(err) {
        throw err;
    }
}

/** Get user by phone */
self.getUserByPhone = async (phone) => {
    try {
        return await User.findOne({where: { phone }});
    } catch(err) {
        throw err;
    }
}

/** Verify user email */
self.verifyUserEmail = async (user_id) => {
    try {
        return await User.update(
            { is_email_verified: true },
            { where: { user_id }}
        );
    } catch(err) {
        throw err;
    }
}

/** Verify user phone */
self.verifyUserPhone = async (user_id) => {
    try {
        return await User.update(
            { is_phone_verified: true },
            { where: { user_id }}
        );
    } catch(err) {
        throw err;
    }
}

/** Delete user by id */
self.deleteUserById = async (id) => {
    try {
        return await User.destroy({
            where: {
                user_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;