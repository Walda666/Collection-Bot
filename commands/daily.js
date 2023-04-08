const discord = require('discord.js')
db = require('../db')
cooldownDailyBonus = []
module.exports = {
    run: async(message) => {
        function emb(user, commande, messag, titre, couleur) {
            embed = new discord.MessageEmbed()
            .setColor(`${couleur}`)
            .setTitle(`${titre}`)
        
            .setDescription(`${messag} 

${user}`)
            .setFooter(`Commande : ${commande}
            `)
            return embed
        }      

        userId = message.author.id
        if(cooldownDailyBonus.includes(userId)) {
            return message.channel.send(emb(message.author, message, "Vous êtes en cooldown sur cette commande", "", "YELLOW"))
        } else {
            cooldownDailyBonus.push(userId)

        db.query(`SELECT * FROM utilisateur WHERE id_discord = '${userId}'`, function (err, result) {
            if(result.length == 0) return
            if (err) throw err;
            balance = result[0].balance
            dailyRandom = Math.floor(Math.random() * 25) + 10
            balance += dailyRandom
            db.query(`UPDATE utilisateur SET balance = ${balance} WHERE id_discord = '${userId}'`, function (err, result) {
            if(result.length == 0) return
            if(err) throw err;
            return message.channel.send(emb(message.author, message, `Vous venez de claim votre bonus journalier de ${dailyRandom}.
Vous êtes désormais à ${balance} coins`, "", "GREEN"))
            })
            });   

            setTimeout(() => {
                const index = cooldownDailyBonus.indexOf(message.author.id);
                if (index > -1) {
                    cooldownDailyBonus.splice(index, 1);
                }
            }, 24 * 3600 * 1000);

        }
    },
    name: 'dailybonus'
}