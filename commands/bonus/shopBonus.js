const discord = require('discord.js')
db = require('../../db')
module.exports = {
    run: (message) => {
        userId = message.author.id
        tab = []
        db.query(`SELECT id, nom, prix FROM bonus`, function (err, result) {
            if (err) throw err;
            for(i = 0; i < result.length; i++) tab.push([result[i].id, result[i].nom, result[i].prix])
            description = ""

            for(i = 0; i < tab.length; i++) {
                description += `${tab[i][0]}.   ${tab[i][1]} -  ${tab[i][2]} coins\n\n`
            }

            let embed = new discord.MessageEmbed()
            .setTitle("Shop - Bonus")
            .setDescription(description)

            message.channel.send(embed)

            });     
    },
    name: 'shopbonus'
}