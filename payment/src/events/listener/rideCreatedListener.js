const {Listener, Subjects, NotFoundError} = require('@jordonuber/common')
const Ride = require('../../model/Rides')
const Payment = require('../../model/Payment')

class rideCreatedListener extends Listener {
    subject = Subjects.RideCreated;
    queueGroupName = 'Payment-Service';
    async onMessage(data, msg) {
        
        const {passenger, driver, pickupLocation, dropoffLocation, fare, status, paymentStatus, paymentMethod, _id } = data.ride

        const ride = new Ride({
            _id:_id,
            passenger,
            driver,
            pickupLocation,
            dropoffLocation,
            fare,
            status,
            paymentStatus,
            paymentMethod,
        })

        await ride.save()

        if(paymentMethod == 'cash') {
            //create Payment

            const payment = new Payment({
                rideId: _id,
                amount: fare,
                paymentMethod,
                status: 'pending',
            })
            await payment.save()
        }
        msg.ack()
    }
}

module.exports = { rideCreatedListener }