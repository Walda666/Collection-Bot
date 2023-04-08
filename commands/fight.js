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
           
        if(args.length != 3) {
            message.channel.send(`${message.author} Veuillez mettre un utilisateur, un thème et un montant de pari`)
            return
        }    
        usermention = args[0]
        theme = args[1]
        pari = args[2]

        if(theme != "minecraft" && theme != "lol" && theme != "humour") {
            message.channel.send(`${message.author} Les stats sont "minecraft", "lol" et "humour"`)
            return
        }
        userId = message.author.id
 

        const filter1 = (m) => {
            return m.author.id === usermention.substring(3,21)
        }

        const filter2 = (m) => {
            return m.author.id === userId && m.toString().substring(0,1) != "."
        }

        const filter3 = (m) => {
            return m.author.id === usermention.substring(3,21) && m.toString().substring(0,1) != "."
        }

        const collector = new discord.MessageCollector(message.channel, filter1, {
            max : 1,
            time: 1000 * 50
        })

        message.channel.send(`${usermention} Veuilez accepter avec o ou annuler avec n`)

        collector.on('end', (collected) => {
           tab = []
           collected.forEach((value) => {
           tab.push(value.content)
            })

            if(tab.length == 0) {
              message.channel.send("Requête expirée") 
            }

            if(tab[0] == "o" || tab[0] == "O") {

                const collector2 = new discord.MessageCollector(message.channel, filter2, {
                    max : 1,
                    time: 1000 * 50
                })

                message.channel.send(`${message.author} Choisissez votre personnage`) 

                collector2.on('end', (collected2) => {
                    tab2 = []
                    collected2.forEach((value) => {
                    tab2.push(value.content)
                     })
                     const collector3 = new discord.MessageCollector(message.channel, filter3, {
                        max : 1,
                        time: 1000 * 50
                    })

                    message.channel.send(`${usermention} Choisissez votre personnage`)

                    collector3.on('end', (collected3) => {
                        tab3 = []
                        collected3.forEach((value) => {
                        tab3.push(value.content)

                        db.query(`SELECT S.id, P.nom, S.${stats[theme]} AS stat FROM spawn S JOIN utilisateur U ON U.id = S.utilisateur JOIN personnage P ON P.id = S.personnage WHERE S.idByUser = '${tab2[0]}' AND U.id_discord = '${userId}'`, function (err, result) {
                            if(err) throw err
                            perso1 = result[0].nom
                            stat1 = result[0].stat

                            db.query(`SELECT S.id, P.nom, S.${stats[theme]} AS stat FROM spawn S JOIN utilisateur U ON U.id = S.utilisateur JOIN personnage P ON P.id = S.personnage WHERE S.idByUser = '${tab3[0]}' AND U.id_discord = '${usermention.substring(3,21)}'`, function (err2, result2) {
                                if(err2) throw err2
                                perso2 = result2[0].nom
                                stat2 = result2[0].stat
    
                                message.channel.send(`Le combat entre ${perso1} et ${perso2} commence !`)

                                setTimeout(() => {
                                    total = 20 + stat1 + stat2
                                    random = Math.floor(Math.random() * total) + 1                                 
                                    if(random <= 10 + stat1) {
                                        message.channel.send(`${perso1} revient vainqueur !`)
                                        db.query(`UPDATE utilisateur SET xp = xp + 5, balance = balance + ${parseInt(pari)} WHERE id_discord = '${userId}'`, function (erreur, resultat) {
                                            if(erreur) throw erreur
                                        }); 
                                        db.query(`UPDATE utilisateur SET balance = balance - ${parseInt(pari)} WHERE id_discord = '${usermention.substring(3,21)}'`, function (erreur, resultat) {
                                            if(erreur) throw erreur
                                        }); 

                                    }
                                    else {
                                        message.channel.send(`${perso2} revient vainqueur !`)
                                        db.query(`UPDATE utilisateur SET xp = xp + 5, balance = balance + ${parseInt(pari)} WHERE id_discord = '${usermention.substring(3,21)}'`, function (erreur, resultat) {
                                            if(erreur) throw erreur
                                        });
                                        db.query(`UPDATE utilisateur SET balance = balance - ${parseInt(pari)} WHERE id_discord = '${userId}'`, function (erreur, resultat) {
                                            if(erreur) throw erreur
                                        }); 
                                    }
                                    // up niveau player
                                    // faire la transaction d'argent
                                    // en bas else (requete annulée )




                                    }, 5000);

                            });

                        });
                     });
                 });

            })

            } else {
                message.channel.send("Annulé")
                return
            }
        });
    },
    name: 'fight'
}