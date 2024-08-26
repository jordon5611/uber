const { Publisher, Subjects } = require('@jordonuber/common')


class rideCreatedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.RideCreated;
    }
}

module.exports = { rideCreatedPublisher }