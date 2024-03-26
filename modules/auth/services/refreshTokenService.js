const { Op } = require('sequelize');
const { RefreshToken } = require('../../../models');
let self = {};

/** Create refresh token */
self.createRefreshToken = async (data) => {
    try {
        console.log(data)
        return await RefreshToken.create(data);
    } catch(err) {
        throw err;
    }
}

/** Get refresh token by id */
self.getRefreshTokenById = async (id) => {
    try {
        return await RefreshToken.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get refresh token by refresh_toek */
self.getRefreshTokenByToken = async (refresh_token) => {
    try {
        return await RefreshToken.findOne({where: { refresh_token }});
    } catch(err) {
        throw err;
    }
}

/** Get refresh token by user_id */
self.getRefreshTokensByUserId = async (user_id) => {
    try {
        return await RefreshToken.findAll({where: { user_id }});
    } catch(err) {
        throw err;
    }
}

/** Get refresh token by client_id */
self.getRefreshTokensByClientId = async (client_id) => {
    try {
        return await RefreshToken.findAll({where: { client_id }});
    } catch(err) {
        throw err;
    }
}

/** Get refresh token by clientAndToken */
self.getRefreshTokenByClientAndToken = async (client_id, refresh_token) => {
    try {
        return await RefreshToken.findOne({where: { client_id, refresh_token }});
    } catch(err) {
        throw err;
    }
}

/** Delete refresh token by id */
self.deleteRefreshTokenById = async (id) => {
    try {
        return await RefreshToken.destroy({
            where: {
                refresh_token_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;