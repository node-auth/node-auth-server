const { Op } = require('sequelize');
const { uuidv7 } = require("uuidv7");
const { Role } = require('../../../models');
let self = {};

/** Create role */
self.createRole = async (data) => {
    try {
        data['role_uuid'] = uuidv7();
        return await Role.create(data);
    } catch (err) {
        throw err;
    }
}

/** Update rple */
self.updateRole = async (data) => {
    try {
        return await Role.update(
            data,
            { where: { role_id: data['role_id'] } }
        );
    } catch (err) {
        throw err;
    }
}

/** Get role by id */
self.getRoleById = async (id) => {
    try {
        return await Role.findByPk(id);
    } catch (err) {
        throw err;
    }
}

/** Get roles by code */
self.getRoleByCode = async (code) => {
    try {
        return await Role.findOne({ where: { code } });
    } catch (err) {
        throw err;
    }
}

/** Delete role by id */
self.deleteRoleById = async (id) => {
    try {
        return await Role.destroy({
            where: {
                role_id: id
            }
        })
    } catch (err) {
        throw err;
    }
}

module.exports = self;