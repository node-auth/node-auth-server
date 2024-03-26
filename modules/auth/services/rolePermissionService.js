const { Op } = require('sequelize');
const { RolePermission } = require('../../../models');
let self = {};

/** Create role permission */
self.createRolePermission = async (data) => {
    try {
        return await RolePermission.create(data);
    } catch(err) {
        throw err;
    }
}

/** Update role Permission */
self.updateRolePermission = async (data) => {
    try {
        return await RolePermission.update(
            data,
            { where: { role_permission_id: data['role_permission_id'] }}
        );
    } catch(err) {
        throw err;
    }
}

/** Get role permission by id */
self.getRolePermissionById = async (id) => {
    try {
        return await RolePermission.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get role permissions by role id */
self.getRolePermissionsByRoleId = async (id) => {
    try {
        return await RolePermission.findAll({
            where: { role_id: id }
        });
    } catch(err) {
        throw err;
    }
}

/** Get permission by role id and permission id */
self.getPermissionByRoleIdAndPermissionId = async (role_id, permission_id) => {
    try {
        return await RolePermission.findOne({where: { role_id, permission_id }});
    } catch(err) {
        throw err;
    }
}

/** Delete role permission by role id */
self.deleteRolePermissionByRoleId = async (role_id) => {
    try {
        return await RolePermission.destroy({
            where: { role_id }
        })
    } catch(err) {
        throw err;
    }
}

/** Delete role permission by id */
self.deleteRolePermissionById = async (id) => {
    try {
        return await RolePermission.destroy({
            where: {
                role_permission_id: id
            }
        });
    } catch(err) {
        throw err;
    }
}

module.exports = self;