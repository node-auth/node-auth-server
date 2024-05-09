const { Op } = require('sequelize');
const { uuidv7 } = require("uuidv7");
const { ApiPermission } = require('../../../models');
let self = {};

/** Create api permission */
self.createApiPermission = async (data) => {
    try {
        data['api_permission_uuid'] = uuidv7();
        return await ApiPermission.create(data);
    } catch (err) {
        throw err;
    }
}

/** Update api Permission */
self.updateApiPermission = async (data) => {
    try {
        return await ApiPermission.update(
            data,
            { where: { api_permission_id: data['api_permission_id'] } }
        );
    } catch (err) {
        throw err;
    }
}

/** Get api permission by id */
self.getApiPermissionById = async (id) => {
    try {
        return await ApiPermission.findByPk(id);
    } catch (err) {
        throw err;
    }
}

/** Get api permissions by id */
self.getApiPermissionByApiId = async (id) => {
    try {
        return await ApiPermission.findAll({
            where: { api_id: id }
        });
    } catch (err) {
        throw err;
    }
}

/** Get api permission by api id and permission id */
self.getPermissionApiIdAndPermissionId = async (api_id, permission_id) => {
    try {
        return await ApiPermission.findOne({ where: { api_id, permission_id } });
    } catch (err) {
        throw err;
    }
}

/** Delete api permission by id */
self.deleteApiPermissionById = async (id) => {
    try {
        return await ApiPermission.destroy({
            where: {
                api_permission_id: id
            }
        })
    } catch (err) {
        throw err;
    }
}

module.exports = self;