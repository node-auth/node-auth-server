const { Op } = require('sequelize');
const { ApplicationPermission } = require('../../../models');
let self = {};

/** Create application permission */
self.createApplicationPermission = async (data) => {
    try {
        return await ApplicationPermission.create(data);
    } catch(err) {
        throw err;
    }
}

/** Update application Permission */
self.updateApplicationPermission = async (data) => {
    try {
        return await ApplicationPermission.update(
            data,
            { where: { application_permission_id: data['application_permission_id'] }}
        );
    } catch(err) {
        throw err;
    }
}

/** Get application permission by id */
self.getApplicationPermissionById = async (id) => {
    try {
        return await ApplicationPermission.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get application permissions by application id */
self.getApplicationPermissionsByApplicationId = async (id) => {
    try {
        return await ApplicationPermission.findAll({
            where: { application_id: id }
        });
    } catch(err) {
        throw err;
    }
}

/** Get application permission by application id and permission id */
self.getPermissionApplicationIdAndPermissionId = async (application_id, permission_id) => {
    try {
        return await ApplicationPermission.findOne({where: { application_id, permission_id }});
    } catch(err) {
        throw err;
    }
}

/** Delete application permission by application id */
self.deleteApplicationPermissionByApplicationId = async (application_id) => {
    try {
        return await ApplicationPermission.destroy({
            where: { application_id }
        })
    } catch(err) {
        throw err;
    }
}

/** Delete application permission by id */
self.deleteApplicationPermissionById = async (id) => {
    try {
        return await ApplicationPermission.destroy({
            where: {
                application_permission_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;