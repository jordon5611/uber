const { Publisher, Subjects } = require('@jordonuber/common')


class DriverCreatedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.DriverCreated;
    }
}

module.exports = { DriverCreatedPublisher }