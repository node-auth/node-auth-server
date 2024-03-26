class UserAuthData {
    constructor(res, request_user_uuid = null) {
        this.user_id = res.locals.user.user_id;
        this.user_uuid = res.locals.user.user_uuid;
        this.name = res.locals.user.name;
        this.email = res.locals.user.email;
        this.role = res.locals.user.role;
        this.request_user_uuid = request_user_uuid;
    }
    isDataOwner() { return this.user_uuid === this.request_user_uuid; }
    getUserId() { return this.user_id; }
    getUserUUID() { return this.user_uuid; }
    getName() { return this.name; }
    getEmail() { return this.email; }
    getRole() { return this.role; }
}

module.exports = UserAuthData;