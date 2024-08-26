const {Listener, Subjects, NotFoundError} = require('@jordonuber/common')
const Ride = require('../../model/Rides')

class rideUpdatedListener extends Listener {
    subject = Subjects.RideCompletedOrCancelled;
    queueGroupName = 'Payment-Service';
    async onMessage(data, msg) {
        
        const {status, paymentStatus , id , version, rideStartTime, rideEndTime } = data.ride

        const ride = await Ride.findOne({_id: id, version: version - 1});

        if(!ride){
            throw new NotFoundError('Ride not found');
        }

        if(status) ride.status = status;
        if(paymentStatus) ride.paymentStatus = paymentStatus;
        if(rideStartTime) ride.rideStartTime = rideStartTime;
        if(rideEndTime) ride.rideEndTime = rideEndTime;

        await ride.save();

        msg.ack();
    }
}

module.exports = { rideUpdatedListener }