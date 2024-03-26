const { Op } = require('sequelize');
const { UserRole } = require('../../../models');
let self = {};

/** Create user role */
self.createUserRole = async (data) => {
    try {
        return await UserRole.create(data);
    } catch(err) {
        throw err;
    }
}

/** Get user role by id */
self.getUserRoleById = async (id) => {
    try {
        return await UserRole.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get user roles by user_id */
self.getUserRolesByUserId = async (user_id) => {
    try {
        return await UserRole.findAll({where: { user_id }});
    } catch(err) {
        throw err;
    }
}

/** Delete user role by user id */
self.deleteUserRoleByUserId = async (id) => {
    try {
        return await UserRole.destroy({
            where: {
                user_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

/** Delete user role by id */
self.deleteUserRoleById = async (id) => {
    try {
        return await UserRole.destroy({
            where: {
                user_role_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;