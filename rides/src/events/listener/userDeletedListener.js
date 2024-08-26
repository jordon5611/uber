const {Listener, Subjects} = require('@jordonuber/common')
const User = require('../../model/User')

class userDeletedListener extends Listener {
    subject = Subjects.UserDeleted;
    queueGroupName = 'Rides-Service';
    async onMessage(data, msg) {
        
        const {id } = data

        await User.findByIdAndDelete(id)

        msg.ack()
    }
}

module.exports = {userDeletedListener}