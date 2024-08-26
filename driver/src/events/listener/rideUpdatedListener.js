const {Listener, Subjects, NotFoundError} = require('@jordonuber/common')
const Driver = require('../../model/Driver')

class rideUpdatedListener extends Listener {
    subject = Subjects.RideCompletedOrCancelled;
    queueGroupName = 'Driver-Service';
    async onMessage(data, msg) {
        
        const {id, status, version } = data.Driver

        console.log(data)

        const driver = await Driver.findOne({_id: id, version: version - 1});

        if(!driver){
            throw new NotFoundError('Driver not found')
        }

        driver.status = status

        await driver.save()

        msg.ack()
    }
}

module.exports = { rideUpdatedListener }