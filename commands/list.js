const discord = require('discord.js')
db = require('../db')
const pagination = require('discord.js-pagination')
module.exports = {
    run: async (message) => {
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

        tab = []

        userId = message.author.id
        db.query(`SELECT P.nom, P.description, S.rarete, S.etat, S.stat_mc, S.idByUser FROM spawn S JOIN utilisateur U ON U.id = S.utilisateur JOIN personnage P ON P.id = S.personnage WHERE U.id_discord = '${userId}' ORDER BY S.idByUser DESC`, function (err, result) {
            if (err) throw err;
            for(let $i = 0; $i < result.length; $i++) tab.push([result[$i].nom, result[$i].description, result[$i].rarete, result[$i].etat, result[$i].stat_mc, result[$i].idByUser])

            let pages = []
            let int = tab.length
            let quotient = Math.floor(int/6);
            let reste = int % 6
            let fin = int - reste
            
            for(let $i = 0; $i < quotient; $i++) {
                let embedA = new discord.MessageEmbed()
                .setTitle(`Liste ${message.author.username} - ${$i+1}`)

                for(let $j = 6*$i; $j < 6*$i+6; $j++) {
                    embedA.addField(tab[$j][0], `${tab[$j][5]}. ${tab[$j][2]}, Etat : ${etats[tab[$j][3]]}, Stat Minecraft : ${tab[$j][4]}`)
                }
                pages.push(embedA)
            }
            let embedB = new discord.MessageEmbed()
            .setTitle(`Page  ${quotient+1}`)
            for(let $k = 0; $k < reste; $k++) {
                embedB.addField(tab[$k + fin][0], `${tab[$k + fin][5]}. ${tab[$k + fin][2]}, Etat : ${etats[tab[$k + fin][3]]}`)
            }
            pages.push(embedB)


            let emojis = ["⬅️", "➡️"]
            const timeout = '1000000'
            pagination(message, pages, emojis, timeout)



            });   
        
    },
    name: 'list'
}