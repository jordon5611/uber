const {Listener, Subjects} = require('@jordonuber/common')
const Driver = require('../../model/Driver')

class driverCreatedListener extends Listener {
    subject = Subjects.DriverCreated;
    queueGroupName = 'Rides-Service';
    async onMessage(data, msg) {
        
        const {id, email, name, vehicleInfo } = data

        console.log(id, email, name, vehicleInfo)

        const newDriver = new Driver({_id: id , email, name, vehicleInfo})

        await newDriver.save()

        msg.ack()
    }
}

module.exports = { driverCreatedListener }