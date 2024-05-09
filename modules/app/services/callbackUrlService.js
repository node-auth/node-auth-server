const { Op } = require('sequelize');
const { uuidv7 } = require("uuidv7");
const { CallbackUrl } = require('../../../models');
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

/** Update callback url */
self.updateCallbackUrl = async (data) => {
    try {
        return await CallbackUrl.update(
            data,
            { where: { callback_url_id: data['callback_url_id'] } }
        );
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

/** Get callback urls by application id */
self.getCallbackUrlsByApplicationId = async (id) => {
    try {
        return await CallbackUrl.findAll({
            where: { application_id: id }
        });
    } catch (err) {
        throw err;
    }
}

/** Delete callback urls by application id */
self.deleteCallbackUrlsByApplicationId = async (application_id) => {
    try {
        return await CallbackUrl.destroy({
            where: { application_id }
        })
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