const discord = require('discord.js')
db = require('../../db')
module.exports = {
    run: (message, client) => {
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
        tab = []
        db.query(`SELECT BU.idByUser, B.nom FROM bonusutilisateur BU JOIN bonus B ON B.id = BU.bonus JOIN Utilisateur U ON U.ID = BU.utilisateur WHERE id_discord = '${userId}'`, function (err, result) {
            if (err) throw err;
            
            if(result.length == 0) {
                message.channel.send(emb(message.author, message, "Vous n'avez aucun bonus", "ERREUR", "RED"))
                return
            } 
            for(j = 0; j < result.length; j++) tab.push([result[j].idByUser, result[j].nom])

            description = ""

            for(i = 0; i < tab.length; i++) {
                description += `- ${tab[i][1]}\n\n`
                
            }

            let embed = new discord.MessageEmbed()
            .setTitle("Bonus débloqués")
            .setDescription(description)

            message.channel.send(embed)

            });     
    },
    name: 'bonus'
}