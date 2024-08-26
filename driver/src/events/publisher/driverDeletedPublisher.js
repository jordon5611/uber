const { Publisher, Subjects } = require('@jordonuber/common')


class DriverDeletedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.DriverDeleted;
    }
}

module.exports = { DriverDeletedPublisher }