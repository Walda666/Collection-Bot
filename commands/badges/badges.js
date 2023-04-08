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
        db.query(`SELECT BU.idByUser, B.nom, B.nom_emoji FROM badgeutilisateur BU JOIN badge B ON B.id = BU.badge JOIN Utilisateur U ON U.ID = BU.utilisateur WHERE id_discord = '${userId}'`, function (err, result) {
            if (err) throw err;
            
            if(result.length == 0) {
                message.channel.send(emb(message.author, message, "Vous n'avez aucun badge", "ERREUR", "RED"))
                return
            } 
            for(j = 0; j < result.length; j++) tab.push([result[j].idByUser, result[j].nom, result[j].nom_emoji])

            description = ""

            for(i = 0; i < tab.length; i++) {
                description += `${tab[i][0]}. ${emojis[tab[i][2]]} ${tab[i][1]}\n\n`
            }

            let embed = new discord.MessageEmbed()
            .setTitle("Liste des badges")
            .setDescription(description)

            message.channel.send(embed)

            });     
    },
    name: 'badges'
}