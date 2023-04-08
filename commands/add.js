const db = require('../db')
const Discord = require('discord.js')
module.exports = {
    run: (message, args) => {
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
        if(args.length != 2) {
            message.channel.send(emb(message.author, message, "Pas le bon nombre d'arguments", "ERREUR", "RED"))
            return 
        } 

        db.query(`INSERT INTO personnage(nom, description, image) VALUES ('${args[0]}', 'NULL', '${args[1]}')`, function (err, result) {
            if (err) throw err;
            message.channel.send(emb(message.author, message, "Good", "VALIDÉ", "GREEN"))
        });
        
                
    },
    name: 'add'
}