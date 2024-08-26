const {Listener, Subjects} = require('@jordonuber/common')
const Ride = require('../../model/Rides')

class paymentCreatedListener extends Listener {
    subject = Subjects.PaymentCreated;
    queueGroupName = 'Rides-Service';
    async onMessage(data, msg) {
        
        const {id, version, paymentStatus } = data

        const ride = await Ride.findOne({_id: id, version: version - 1});

        if(!ride){
            throw new NotFoundError('Ride not found');
        }
        
        ride.paymentStatus = paymentStatus;
        await ride.save();

        msg.ack()
    }
}

module.exports = { paymentCreatedListener }