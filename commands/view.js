const discord = require('discord.js')
db = require('../db')
module.exports = {
    run: async (message, args) => {
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

        if(args.length != 1) {
            return message.channel.send(emb(message.author, message, "Veuillez entrer un n°", "ERREUR", "RED"))
        } 
        perso = args[0]

        userId = message.author.id
        db.query(`SELECT P.nom, P.description, P.image, S.rarete, S.etat, S.stat_mc, S.stat_lol, S.stat_humour FROM spawn S JOIN utilisateur U ON U.id = S.utilisateur JOIN personnage P ON P.id = S.personnage WHERE S.idByUser = '${perso}' AND U.id_discord = '${userId}'`, function (err, result) {
            if (err) throw err;
            if(result.length == 0) return message.channel.send(emb(message.author, message, "Veuillez mettre un n° valide", "ERREUR", "RED"))

            desc = ""
            if(result[0].description != "NULL")  desc = result[0].description

            let embed = new discord.MessageEmbed()
            .setTitle(result[0].nom)
            .setDescription(`${desc}
            
Etat : ${etats[result[0].etat]}

Stat Minecraft : ${result[0].stat_mc}
Stat LoL : ${result[0].stat_lol}
Stat Humour : ${result[0].stat_humour}`)
            .setImage(result[0].image)
            .setColor(colors[result[0].rarete])

            message.channel.send(embed)
        });
    },
    name: 'view'
}