const { Publisher, Subjects } = require('@jordonuber/common')


class UserUpdatedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.UserUpdated;
    }
}

module.exports = { UserUpdatedPublisher }