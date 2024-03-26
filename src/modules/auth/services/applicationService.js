const { Op } = require('sequelize');
const { Application } = require('../../../models');
let self = {};

/** Create application */
self.createApplication = async (userData) => {
    try {
        return await Application.create(userData);
    } catch(err) {
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
    } catch(err) {
        throw err;
    }
}

/** Get application by id */
self.getApplicationById = async (id) => {
    try {
        return await Application.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get application by client id */
self.getApplicationByClientId = async (client_id) => {
    try {
        return await Application.findOne({where: { client_id }});
    } catch(err) {
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
    } catch(err) {
        throw err;
    }
}

module.exports = self;