const { Op } = require('sequelize');
const { uuidv7 } = require("uuidv7");
const { Permission, sequelize } = require('../../../models');
let self = {};

/** Create permission */
self.createPermission = async (data) => {
    try {
        data['permission_uuid'] = uuidv7();
        return await Permission.create(data);
    } catch (err) {
        throw err;
    }
}

/** Update permission */
self.updatePermission = async (data) => {
    try {
        return await Permission.update(
            data,
            { where: { permission_id: data['permission_id'] } }
        );
    } catch (err) {
        throw err;
    }
}

/** Get auth permissions */
self.getAuthPermissions = async () => {
    try {
        const query = `
            select permissions.permission_identifier from apis
            left join api_permissions on apis.api_id = api_permissions.api_id
            left join permissions on api_permissions.permission_id = permissions.permission_id
            where permissions.is_default = true
        `;
        const qResult = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        const result = qResult.map(item => item.permission_identifier);
        return result;
    } catch (err) {
        throw err;
    }
}

/** Get user permissions */
self.getUserPermissions = async (userId) => {
    try {
        const query = `
        SELECT apis.api_identifier, permissions.permission_identifier
        FROM permissions
        LEFT JOIN api_permissions ON permissions.permission_id = api_permissions.permission_id
        LEFT JOIN apis ON api_permissions.api_id = apis.api_id
        LEFT JOIN user_permissions ON permissions.permission_id = user_permissions.permission_id
        LEFT JOIN role_permissions ON permissions.permission_id = role_permissions.permission_id
        LEFT JOIN user_roles ON role_permissions.role_id = user_roles.role_id
        LEFT JOIN users ON user_permissions.user_id = users.user_id OR user_roles.user_id = users.user_id
        WHERE users.user_id = :userId
        GROUP BY apis.api_identifier, permissions.permission_identifier`;
        const qResult = await sequelize.query(query, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        });
        /** Format data */
        const result = {};
        qResult.forEach(item => {
            const { api_identifier, permission_identifier } = item;
            if (!result[api_identifier]) {
                result[api_identifier] = [];
            }
            result[api_identifier].push(permission_identifier);
        });
        return result;
    } catch (err) {
        throw err;
    }
}

/** Get application permissions */
self.getApplicationPermissions = async (clientId, clientSecret) => {
    try {
        const query = `
        select apis.api_identifier, permissions.permission_identifier
        from permissions
        left join api_permissions on permissions.permission_id = api_permissions.permission_id
        left join apis on api_permissions.api_id = apis.api_id
        left join application_permissions on permissions.permission_id = application_permissions.permission_id
        left join applications on application_permissions.application_id = applications.application_id
        where
            applications.client_id = :clientId and
            applications.client_secret = :clientSecret and
            applications.application_type = :applicationType
        group by apis.api_identifier, permissions.permission_identifier`;
        const qResult = await sequelize.query(query, {
            replacements: { clientId, clientSecret, applicationType: 'M2M' },
            type: sequelize.QueryTypes.SELECT
        });
        /** Format data */
        const result = {};
        qResult.forEach(item => {
            const { api_identifier, permission_identifier } = item;
            if (!result[api_identifier]) {
                result[api_identifier] = [];
            }
            result[api_identifier].push(permission_identifier);
        });
        return result;
    } catch (err) {
        throw err;
    }
}

/** Get permission by id */
self.getPermissionById = async (id) => {
    try {
        return await Permission.findByPk(id);
    } catch (err) {
        throw err;
    }
}

/** Delete permission by id */
self.deletePermissionById = async (id) => {
    try {
        return await Permission.destroy({
            where: {
                permission_id: id
            }
        })
    } catch (err) {
        throw err;
    }
}

module.exports = self;