const discord = require('discord.js')
db = require('../db')
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
            return message.channel.send(emb(message.author, message, "Veuillez mettre un personnage et un thème", "ERREUR", "RED"))
        }    
        perso = args[0]
        theme = args[1]

        if(theme != "minecraft" && theme != "lol" && theme != "humour") {
            return message.channel.send(emb(message.author, message, `Les stats sont "minecraft", "lol" et "humour`, "ERREUR", "RED"))
        }

        userId = message.author.id

        db.query(`SELECT etat FROM spawn S JOIN utilisateur U ON U.id = S.utilisateur WHERE U.id_discord = '${userId}'`, function (er, res) {
            if(res.length == 0) return
            if(er) throw er
            let temptab = []
            for(i = 0; i < res.length; i++) temptab.push(res[i].etat)

            if(temptab.includes(4)) {
                return message.channel.send("Un de vos personnages est déjà en entraînement")
            } else {

        db.query(`SELECT S.etat, U.id, P.nom FROM spawn S JOIN utilisateur U ON S.utilisateur = U.id JOIN personnage P ON P.id = S.personnage WHERE U.id_discord = '${userId}' AND S.idByUser = '${perso}'`, function (err, result) {
            if (err) throw err;
            if(result.length == 0) return message.channel.send(emb(message.author, message, "Veuillez mettre un n° valide", "ERREUR", "RED"))
            resultat = result[0]
            if(resultat.etat == 4) {
                return message.channel.send(emb(message.author, message, "Ce personnage est déjà occupé", "ERREUR", "RED"))
            } else {
                db.query(`UPDATE spawn SET etat = 4 WHERE utilisateur = '${resultat.id}' AND idByUser = '${perso}'`, function (err2, result2) {
                    if (err2) throw err2;
                    else message.channel.send(emb(message.author, message, `Vous avez envoyé ${resultat.nom} s'entrainer ! Il reviendra dans 6 heures`, "", "GREEN"))
                });
            }
            });
        } 
        });


        setTimeout(() => {
            xp = Math.floor(Math.random() * 5) + 3
            db.query(`UPDATE spawn S JOIN utilisateur U ON U.id = S.utilisateur SET S.${stats[theme]} = S.${stats[theme]} + ${xp}, S.etat = 0 WHERE U.id_discord = '${userId}' AND S.idByUser = '${perso}'`, function (err, result) {
                if(result.length == 0) return
                if (err) throw err;
                
            });
        }, 1000 * 6 * 3600);
    },
    name: 'train'
}