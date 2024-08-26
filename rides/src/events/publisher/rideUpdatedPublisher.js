const { Publisher, Subjects } = require('@jordonuber/common')


class rideUpdatedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.RideCompletedOrCancelled;
    }
}

module.exports = { rideUpdatedPublisher }