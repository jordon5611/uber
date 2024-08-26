const {Listener, Subjects, NotFoundError} = require('@jordonuber/common')
const Driver = require('../../model/Driver')

class driverUpdatedListener extends Listener {
    subject = Subjects.DriverUpdated;
    queueGroupName = 'Rides-Service';
    async onMessage(data, msg) {
        
        const {id, email, name, vehicleInfo, isVerified ,status, location, version } = data

        const driver = await Driver.findOne({_id: id, version: version - 1});

        if(!driver){
            throw new NotFoundError('Driver not found')
        }

        if(email) driver.email = email
        if(name) driver.name = name
        if(vehicleInfo) driver.vehicleInfo = vehicleInfo
        if(isVerified) driver.isVerified = isVerified
        if(status) driver.status = status
        if(location) driver.location = location

        await driver.save()

        msg.ack()
    }
}

module.exports = { driverUpdatedListener }