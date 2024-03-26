const { Op } = require('sequelize');
const { AuthorizationCode } = require('../../../models');
let self = {};

/** Create authorization code */
self.createAuthorizationCode = async (data) => {
    try {
        return await AuthorizationCode.create(data);
    } catch(err) {
        throw err;
    }
}

/** Get authorization code */
self.getAuthorizationCode = async (code, client_id) => {
    try {
        return await AuthorizationCode.findOne({
            where: { code, client_id },
        });
    } catch(err) {
        throw err;
    }
}

/** Delete authorization code */
self.deleteAuthorizationCode = async (id) => {
    try {
        return await AuthorizationCode.destroy({
            where: {
                authorization_code_id: id
            }
        })
    } catch(err) {
        throw err;
    }
}

module.exports = self;