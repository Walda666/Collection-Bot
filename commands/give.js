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

        mention = args[0]
        perso = args[1]
        userId = message.author.id
        idMention = mention.substring(3,21)
        const filter1 = (m) => {
            return m.author.id === message.author.id
        }

        const filter2 = (m) => {
            return m.author.id === idMention
        }

          const collector = new discord.MessageCollector(message.channel, filter1, {
              max : 1,
              time: 1000 * 30
          })
          message.channel.send(emb(message.author, message.content.trim().split(/ +/g)[0], "Veuilez confirmer avec O ou annuler avec N", "CONFIRMATION", "BLACK"))

          collector.on('end', (collected) => {
             tab = []
             collected.forEach((value) => {
             tab.push(value.content)
              })

              if(tab.length == 0) {
                return message.channel.send(emb(message.author, message.content.trim().split(/ +/g)[0], "Requête expirée", "ERREUR", "RED"))
                }
              if(tab[0] == "o" || tab[0] == "O") {

                const collector2 = new discord.MessageCollector(message.channel, filter2, {
                    max : 1,
                    time: 1000 * 30
                })
                message.channel.send(emb(mention, message.content.trim().split(/ +/g)[0], "Veuilez confirmer avec O ou annuler avec N", "CONFIRMATION", "BLACK"))

                collector2.on('end', (collected2) => {
                    tab2 = []
                    collected2.forEach((value2) => {
                    tab2.push(value2.content)
                     })
       
                     if(tab2.length == 0) {
                        return message.channel.send(emb(message.author, message.content.trim().split(/ +/g)[0], "Requête expirée", "ERREUR", "RED"))
                       }

                       if(tab2[0] == "o" || tab2[0] == "O") {
                        db.query(`SELECT S.id FROM spawn S JOIN utilisateur U ON U.id = S.utilisateur WHERE S.idByUser = '${perso}' AND U.id_discord = '${userId}'`, function (err, result) {
                            if(result.length == 0) return message.channel.send(emb(message.author, message.content.trim().split(/ +/g)[0], "Veuillez entrer un n° valide", "ERREUR", "RED"))
                            if(err) throw err
                            idSpawn = result[0].id

                            db.query(`SELECT id FROM utilisateur WHERE id_discord = '${userId}'`, function (err2, result2) {
                                if(result.length == 0) return
                                if(err2) throw err2
                                idUtilisateur = result2[0].id

                                db.query(`SELECT S.idByUser FROM spawn S JOIN utilisateur U ON S.utilisateur = U.id WHERE U.id_discord = '${idMention}' ORDER BY S.idByUser DESC`, function (err3, result3) {
                                    if(result3.length == 0) return message.channel.send(emb(mention, message.content.trim().split(/ +/g)[0], "Veuillez entrer un n° valide", "ERREUR", "RED"))
                                    if(err3) throw err3
                                    tableau = []
                                    for(i = 0; i < result3.length; i++) tableau.push(result3[i].idByUser)
                                    if(tableau.length == 0) count = 1          
                                    else count = tableau[0] + 1

                                    db.query(`SELECT id FROM utilisateur WHERE id_discord = '${idMention}'`, function (err4, result4) {
                                        if(result4.length == 0) return
                                        if(err4) throw err4
                                        idMentionDb = result4[0].id

                                        db.query(`UPDATE spawn SET utilisateur = '${idMentionDb}', idByUser = '${count}' WHERE id = '${idSpawn}'`, function (err5, result5) {
                                            if(err4) throw err5
                                            return message.channel.send(emb(message.author, message.content.trim().split(/ +/g)[0], "Trade effectué avec succès", "", "GREEN"))
                                            });  
                                        });
                                    
                                    });   
                                
                                });    
            
                            });     
                       }
                       else message.channel.send(emb(message.author, message.content.trim().split(/ +/g)[0], "Annulé avec succès", "", "ORANGE"))
                    })
              }
              else message.channel.send(emb(message.author, message.content.trim().split(/ +/g)[0], "Annulé avec succès", "", "ORANGE"))
          })
    },
    name: 'give'
}