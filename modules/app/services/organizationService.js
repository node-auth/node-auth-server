const { Op } = require('sequelize');
const { uuidv7 } = require("uuidv7");
const { Organization } = require('../../../models');
let self = {};

/** Create organization */
self.createOrganization = async (data) => {
    try {
        data['organization_uuid'] = uuidv7();
        return await Organization.create(data);
    } catch (err) {
        throw err;
    }
}

/** Update organization */
self.updateOrganization = async (data) => {
    try {
        return await Organization.update(
            data,
            { where: { organization_id: data['organization_id'] } }
        );
    } catch (err) {
        throw err;
    }
}

/** Get organization by id */
self.getOrganizationById = async (id) => {
    try {
        return await Organization.findByPk(id);
    } catch (err) {
        throw err;
    }
}

/** Delete role by id */
self.deleteRoleById = async (id) => {
    try {
        return await Organization.destroy({
            where: {
                organization_id: id
            }
        })
    } catch (err) {
        throw err;
    }
}

module.exports = self;