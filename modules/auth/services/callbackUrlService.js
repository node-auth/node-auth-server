const { Op } = require('sequelize');
const { CallbackUrl, sequelize } = require('../../../models');
let self = {};

/** Create callback url */
self.createCallbackUrl = async (data) => {
    try {
        return await CallbackUrl.create(data);
    } catch(err) {
        throw err;
    }
}

/** Get auth callback urls */
self.getAuthCallbackUrlsByApplicationId = async (application_id) => {
    try {
        return await CallbackUrl.findAll({
            where: {application_id},
        });
    } catch(err) {
        throw err;
    }
}

/** Get callback url by id */
self.getCallbackUrlById = async (id) => {
    try {
        return await CallbackUrl.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Delete callback url by id */
self.deleteCallbackUrlById = async (id) => {
    try {
        return await CallbackUrl.destroy({
            where: {
                callback_url_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;