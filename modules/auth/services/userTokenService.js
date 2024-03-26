const { Op } = require('sequelize');
const { UserToken } = require('../../../models');
let self = {};

/** Create user token */
self.createUserToken = async (data) => {
    try {
        return await UserToken.create(data);
    } catch(err) {
        throw err;
    }
}

/** Get user token by id */
self.getUserTokenById = async (id) => {
    try {
        return await UserToken.findByPk(id);
    } catch(err) {
        throw err;
    }
}

/** Get user auth by user_id */
self.getUserToken = async (user_id, name) => {
    try {
        return await UserToken.findOne({where: { user_id, name }});
    } catch(err) {
        throw err;
    }
}

/** Get user auth by name and Value */
self.getUserTokenByNameAndValue = async (name, value) => {
    try {
        return await UserToken.findOne({where: { name, value }});
    } catch(err) {
        throw err;
    }
}

/** Delete user token by id */
self.deleteUserTokenById = async (id) => {
    try {
        return await UserToken.destroy({
            where: {
                user_token_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;