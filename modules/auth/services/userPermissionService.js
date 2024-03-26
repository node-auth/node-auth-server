const { Op } = require('sequelize');
const { UserPermission } = require('../../../models');
let self = {};

/** Create user permission */
self.createUserPermission = async (data) => {
    try {
        return await UserPermission.create(data);
    } catch(err) {
        throw err;
    }
}

/** Update user Permission */
self.updateUserPermission = async (data) => {
    try {
        return await UserPermission.update(
            data,
            { where: { user_permission_id: data['user_permission_id'] }}
        );
    } catch(err) {
        throw err;
    }
}

/** Get user permission by id */
self.getUserPermissionById = async (id) => {
    try {
        return await UserPermission.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get user permissions by user id */
self.getUserPermissionsByUserId = async (id) => {
    try {
        return await UserPermission.findAll({
            where: { user_id: id }
        });
    } catch(err) {
        throw err;
    }
}

/** Get permission by user id and permission id */
self.getPermissionByUserIdAndPermissionId = async (user_id, permission_id) => {
    try {
        return await UserPermission.findOne({where: { user_id, permission_id }});
    } catch(err) {
        throw err;
    }
}

/** Delete user permission by user id */
self.deleteUserPermissionByUserId = async (user_id) => {
    try {
        return await UserPermission.destroy({
            where: { user_id }
        });
    } catch(err) {
        throw err;
    }
}

/** Delete user permission by id */
self.deleteUserPermissionById = async (id) => {
    try {
        return await UserPermission.destroy({
            where: {
                user_permission_id: id
            }
        });
    } catch(err) {
        throw err;
    }
}

module.exports = self;