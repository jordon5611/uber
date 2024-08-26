const {Listener, Subjects, NotFoundError} = require('@jordonuber/common')
const Driver = require('../../model/Driver')

class driverDeletedListener extends Listener {
    subject = Subjects.DriverDeleted;
    queueGroupName = 'Rides-Service';
    async onMessage(data, msg) {
        
        const {id } = data

        const driver = await Driver.findOne({_id: id});

        if(!driver){
            throw new NotFoundError('Driver not found')
        }

        //delete driver
        await Driver.findByIdAndDelete(id)

        msg.ack()
    }
}

module.exports = { driverDeletedListener }