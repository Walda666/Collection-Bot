const discord = require('discord.js')
db = require('../db')
module.exports = {
    run: (message) => {
        tab = []
        userId = message.author.id
        db.query(`SELECT * FROM utilisateur WHERE id_discord = '${userId}'`, function (err, result) {
            if (err) throw err;
            db.query(`SELECT B.nom_emoji FROM badgeutilisateur BU JOIN badge B ON B.id = BU.badge JOIN Utilisateur U ON U.ID = BU.utilisateur WHERE id_discord = '${userId}' AND BU.surProfil = '1'`, function (err2, result2) {
                if(err2) throw err2

                pseudo = result[0].pseudo
                niveau = result[0].niveau
                balance = result[0].balance

                for(i = 0; i < result2.length; i++) tab.push(result2[i].nom_emoji)

                description = `Level : ${niveau}\n\nBalance : ${balance} coins\n\n`

                if(result2.length != 0) description += "Badges : "
                for(i = 0; i < tab.length; i++) {
                    description += `${emojis[tab[i]]}  `
                }
                message.channel.send(new discord.MessageEmbed()
                .setTitle(pseudo)
                .setDescription(description)
                .setColor("black")
                ) 
                });     
            });
    },
    name: 'profile'
}