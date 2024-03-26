const { Op } = require('sequelize');
const { UserAuth } = require('../../../models');
let self = {};

/** Create user auth */
self.createUserAuth = async (userAuthData) => {
    try {
        return await UserAuth.create(userAuthData);
    } catch(err) {
        throw err;
    }
}

/** Get user auth by id */
self.getUserAuthById = async (id) => {
    try {
        return await UserAuth.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get user auth by user_id */
self.getUserAuthByUserId = async (user_id) => {
    try {
        return await UserAuth.findOne({where: { user_id }});
    } catch(err) {
        throw err;
    }
}

/** Change user password */
self.changeUserPassword = async (user_auth_id, password) => {
    try {
        return await UserAuth.update(
            { password: password },
            { where: { user_auth_id }}
        );
    } catch(err) {
        throw err;
    }
}

/** Delete user auth by id */
self.deleteUserAuthById = async (id) => {
    try {
        return await UserAuth.destroy({
            where: {
                user_auth_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;