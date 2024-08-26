const {Listener, Subjects} = require('@jordonuber/common')
const User = require('../../model/User')

class userCreatedListener extends Listener {
    subject = Subjects.UserCreated;
    queueGroupName = 'Rides-Service';
    async onMessage(data, msg) {
        
        const {id, email, name, country, phoneNumber } = data

        console.log(id, email, name, country, phoneNumber)

        const newUser = new User({_id: id , email, name, country, phoneNumber})

        await newUser.save()

        msg.ack()
    }
}

module.exports = {userCreatedListener}