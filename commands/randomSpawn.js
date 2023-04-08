const db = require('../db')
const Discord = require('discord.js')
cooldownSpawn = false
cd = 0
module.exports = {
    run: (message) => {
        
        if(cooldownSpawn) {
            return
        } else {
            cooldownSpawn = true

            // Définition du cooldown de manière aléatoire

            let alea = dailyRandom = Math.floor(Math.random() * 15) + 60
            cd = alea * 1000 * 60

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

                // Remplacement de Pseudo -> P_____

                let perso1 = perso[1]
                let persoNom = perso1[0] + "  "
                for(let $i = 0; $i < perso1.length -1; $i++) {
                    persoNom += "\\\_\\\_  "
                }

                // Embed avec les infos du personnage spawn

                message.channel.send(new Discord.MessageEmbed()
                .setTitle(persoNom)
                .setDescription(`${rareteString}`)
                .setImage(perso[3])
                .setColor(colors[rareteString])
                .setFooter("Soyez le premier à claim avec .claim [personnage]")
                )

                // Ajout du spawn dans la DB (changer utilisateur par l'id (find db) de la personne qui claim)
                db.query(`INSERT INTO spawn(personnage, rarete, etat, stat_mc, stat_lol, stat_humour) VALUES ('${perso[0]}', '${rareteString}', '0', '0', '0', '0')`, function (err, result) {
                })
                });   
            }  

            setTimeout(() => {
                cooldownSpawn = false
            }, cd);
    },
    name: 'spawn'
}