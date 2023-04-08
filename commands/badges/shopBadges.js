const discord = require('discord.js')
db = require('../../db')
module.exports = {
    run: (message) => {
        userId = message.author.id
        tab = []
        db.query(`SELECT nom, nom_emoji, prix, idShop FROM badge WHERE achetable = '1'`, function (err, result) {
            if (err) throw err;
             
            for(i = 0; i < result.length; i++) tab.push([result[i].nom, result[i].nom_emoji, result[i].prix, result[i].idShop])
            description = ""

            for(i = 0; i < tab.length; i++) {
                description += `${tab[i][3]}.   ${emojis[tab[i][1]]}   ${tab[i][0]}  -  ${tab[i][2]} coins\n\n`
            }

            let embed = new discord.MessageEmbed()
            .setTitle("Shop - Badges")
            .setDescription(description)

            message.channel.send(embed)

            });     
    },
    name: 'shopbadges'
}