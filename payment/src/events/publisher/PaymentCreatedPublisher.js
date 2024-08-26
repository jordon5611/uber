const { Publisher, Subjects } = require('@jordonuber/common')


class paymentCreatedPublisher extends Publisher {
    constructor(client) {
        super(client);
        this.subject = Subjects.PaymentCreated;
    }
}

module.exports = { paymentCreatedPublisher }