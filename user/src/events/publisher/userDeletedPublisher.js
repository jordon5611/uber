const { Publisher, Subjects } = require('@jordonuber/common')


class UserDeletedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.UserDeleted;
    }
}

module.exports = { UserDeletedPublisher }