const { Op } = require('sequelize');
const { uuidv7 } = require("uuidv7");
const { CallbackUrl, sequelize } = require('../../../models');
let self = {};

/** Create callback url */
self.createCallbackUrl = async (data) => {
    try {
        data['callback_url_uuid'] = uuidv7();
        return await CallbackUrl.create(data);
    } catch (err) {
        throw err;
    }
}

/** Get auth callback urls */
self.getAuthCallbackUrlsByApplicationId = async (application_id) => {
    try {
        return await CallbackUrl.findAll({
            where: { application_id },
        });
    } catch (err) {
        throw err;
    }
}

/** Get callback url by id */
self.getCallbackUrlById = async (id) => {
    try {
        return await CallbackUrl.findByPk(id);
    } catch (err) {
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
    } catch (err) {
        throw err;
    }
}

module.exports = self;