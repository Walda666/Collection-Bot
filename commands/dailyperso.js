const discord = require('discord.js')
db = require('../db')
cooldownDailyPerso = []
module.exports = {
    run: (message) => { 
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

        if(cooldownDailyPerso.includes(userId)) {
            return message.channel.send(emb(message.author, message, "Vous êtes en cooldown sur cette commande", "", "YELLOW"))
        } else {
            cooldownDailyPerso.push(message.author.id)

            db.query(`SELECT * FROM personnage`, function (err, result) {
                if (err) throw err;
                let tab = []
                let rareteString = ""
                for(let $i = 0; $i < result.length; $i++) tab.push([result[$i].id, result[$i].nom, result[$i].description, result[$i].image])
                const perso = tab[(Math.floor(Math.random() * tab.length))]
                const rareteNum = Math.floor(Math.random() * 500)
                if(rareteNum == 1) rareteString = "Légendaire"
                else if(rareteNum > 1 && rareteNum < 7) rareteString = "Epique"
                else if(rareteNum > 8 && rareteNum < 24) rareteString = "Ultra rare"
                else if(rareteNum > 25 && rareteNum < 66) rareteString = "Rare"
                else rareteString = "Commun"

                desc = ""
                if(perso[2] != "NULL")  desc = perso[2]

                message.channel.send(new discord.MessageEmbed()
                .setTitle(perso[1])
                .setDescription(`${desc}
${rareteString}`)
                .setImage(perso[3])
                .setColor(colors[rareteString])
                .setFooter(`Dailyperso - ${message.author.username}`)
                )
                
                db.query(`SELECT id FROM utilisateur WHERE id_discord = '${message.author.id}'`, function (err2, result2) {
                    if(result2.length == 0) return
                    if(err2) throw err2;
                    utilisateur = result2[0].id

                    db.query(`SELECT S.idByUser FROM spawn S JOIN utilisateur U ON S.utilisateur = U.id WHERE U.id_discord = '${message.author.id}' ORDER BY S.idByUser DESC`, function (err4, result4) {
                        if(result4.length == 0) return
                        if(err4) throw err4;         
                        tableau = []
                        for(i = 0; i < result4.length; i++) tableau.push(result4[i].idByUser)
                        if(tableau.length == 0) count = 1          
                        else count = tableau[0] + 1

                        db.query(`INSERT INTO spawn(personnage, utilisateur, rarete, etat, stat_mc, stat_lol, stat_humour, idByUser) VALUES ('${perso[0]}', '${utilisateur}', '${rareteString}', '0', '0', '0', '0', '${count}')`, function (err, result) {
                            });
                     });
                 });
              });

              setTimeout(() => {
                const index = cooldownDailyPerso.indexOf(message.author.id);
                if (index > -1) {
                    cooldownDailyPerso.splice(index, 1);
                }
            }, 24 * 3600 * 1000);
          }
     },
    name: 'dailyperso'
}