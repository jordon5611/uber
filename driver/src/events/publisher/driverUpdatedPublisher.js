const { Publisher, Subjects } = require('@jordonuber/common')


class DriverUpdatedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.DriverUpdated;
    }
}

module.exports = { DriverUpdatedPublisher }