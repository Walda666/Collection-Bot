let { config } = require('../db')

config = require('../config.json')
module.exports = {
    run: (message, args) => {
        let channel = args[0]
        let channelId = channel.substring(2,20)
        message.channel.send(channelId)
        config.channel = channelId
        message.channel.send("aa " + config.channel)
    },
    name: 'setchannel'
}