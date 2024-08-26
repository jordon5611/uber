const { Publisher, Subjects } = require('@jordonuber/common')


class UserCreatedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.UserCreated;
    }
}

module.exports = { UserCreatedPublisher }
