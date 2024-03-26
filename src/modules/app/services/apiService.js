const { Op } = require('sequelize');
const { Api } = require('../../../models');
let self = {};

/** Create api */
self.createApi = async (data) => {
    try {
        return await Api.create(data);
    } catch(err) {
        throw err;
    }
}

/** Update api */
self.updateApi = async (data) => {
    try {
        return await Api.update(
            data,
            { where: { api_id: data['api_id'] }}
        );
    } catch(err) {
        throw err;
    }
}

/** Get api by id */
self.getApiById = async (id) => {
    try {
        return await Api.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Delete api by id */
self.deleteApiById = async (id) => {
    try {
        return await Api.destroy({
            where: {
                api_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;