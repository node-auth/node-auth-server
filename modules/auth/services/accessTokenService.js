const { Op } = require('sequelize');
const { uuidv7 } = require("uuidv7");
const { AccessToken } = require('../../../models');
let self = {};

/** Create access token */
self.createAccessToken = async (data) => {
    try {
        data['access_token_uuid'] = uuidv7();
        return await AccessToken.create(data);
    } catch (err) {
        throw err;
    }
}

/** Get access token by id */
self.getAccessTokenById = async (id) => {
    try {
        return await AccessToken.findByPk(id);
    } catch (err) {
        throw err;
    }
}

/** Get access token by access_toek */
self.getAccessTokenByToken = async (access_token) => {
    try {
        return await AccessToken.findOne({ where: { access_token } });
    } catch (err) {
        throw err;
    }
}

/** Get access token by user_id */
self.getAccessTokensByUserId = async (user_id) => {
    try {
        return await AccessToken.findAll({ where: { user_id } });
    } catch (err) {
        throw err;
    }
}

/** Get access token by client_id */
self.getAccessTokensByClientId = async (client_id) => {
    try {
        return await AccessToken.findAll({ where: { client_id } });
    } catch (err) {
        throw err;
    }
}

/** Get refresh token by clientAndToken */
self.getRefreshTokenByClientAndToken = async (client_id, access_token) => {
    try {
        return await UserToken.findOne({ where: { client_id, access_token } });
    } catch (err) {
        throw err;
    }
}

/** Delete access token by id */
self.deleteAccessTokenById = async (id) => {
    try {
        return await AccessToken.destroy({
            where: {
                access_token_id: id
            }
        })
    } catch (err) {
        throw err;
    }
}

module.exports = self;