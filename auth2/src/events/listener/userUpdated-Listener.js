const {Listener, Subjects} = require('@jordonuber/common')
const User = require('../../model/User')

class userUpdatedListener extends Listener {
    subject = Subjects.UserUpdated;
    queueGroupName = 'Auth-Service';
    async onMessage(data, msg) {
        
        const {id, email, name, country, version } = data

        const user = await User.findOne({_id : id, version: version - 1})

        user.name = name
        user.email = email
        user.country = country

        await user.save()

        msg.ack()
    }
}

module.exports = {userUpdatedListener}