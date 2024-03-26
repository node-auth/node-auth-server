const { Op } = require('sequelize');
const { Application } = require('../../../models');
let self = {};

/** Create application */
self.createApplication = async (data) => {
    try {
        return await Application.create(data);
    } catch(err) {
        throw err;
    }
}

/** Update application */
self.updateApplication = async (data) => {
    try {
        return await Application.update(
            data,
            { where: { application_id: data['application_id'] }}
        );
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