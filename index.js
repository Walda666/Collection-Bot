const Discord = require("discord.js");

etats = { 0 : "Normal", 1 : "Heureux", 3: "Salé", 4 : "En entrainement" };
colors = {"Légendaire" : 16776960, "Epique" : 10181046, "Ultra rare" : 15277667, "Rare" : 3066993, "Commun" : 6323595}
stats = {"minecraft" : "stat_mc", "lol" : "stat_lol", "humour" : "stat_humour"}

const client = new Discord.Client({
    fetchAllMembers: true
})
config = require('./config.json')
fs = require('fs')

client.login(config.token);
client.commands = new Discord.Collection()

fs.readdir('./commands', (err, files) => {
    if(err) throw err
    files.forEach(file => {
        if(!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

// Dossier badges 

fs.readdir('./commands/badges', (err, files) => {
    if(err) throw err
    files.forEach(file => {
        if(!file.endsWith('.js')) return
        const command = require(`./commands/badges/${file}`)
        client.commands.set(command.name, command)
    })
})

// Dossier bonus 

fs.readdir('./commands/bonus', (err, files) => {
    if(err) throw err
    files.forEach(file => {
        if(!file.endsWith('.js')) return
        const command = require(`./commands/bonus/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('message', message => {
    if(message.type !== 'DEFAULT' || message.author.bot) return
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if(!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if(!command) return
    command.run(message, args, client)
});


client.once('ready',  () => {
    console.log("Good !");
    client.user.setActivity('Work in progress')
});