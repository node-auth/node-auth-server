const { Op } = require('sequelize');
const { uuidv7 } = require("uuidv7");
const { Application } = require('../../../models');
let self = {};

/** Create application */
self.createApplication = async (data) => {
    try {
        data['application_uuid'] = uuidv7();
        return await Application.create(data);
    } catch (err) {
        throw err;
    }
}

/** Get applications */
self.getApplications = async (searchKey = '') => {
    try {
        return await Application.findAll({
            where: {
                name: {
                    [Op.like]: `%${searchKey}%`
                },
                domain: {
                    [Op.like]: `%${searchKey}%`
                }
            },
        });
    } catch (err) {
        throw err;
    }
}

/** Get application by id */
self.getApplicationById = async (id) => {
    try {
        return await Application.findByPk(id);
    } catch (err) {
        throw err;
    }
}

/** Get application by client id */
self.getApplicationByClientId = async (client_id) => {
    try {
        return await Application.findOne({ where: { client_id } });
    } catch (err) {
        throw err;
    }
}

/** Delete application by id */
self.deleteApplicationById = async (id) => {
    try {
        return await Application.destroy({
            where: {
                application_id: id
            }
        })
    } catch (err) {
        throw err;
    }
}

module.exports = self;