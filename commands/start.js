const discord = require('discord.js')
db = require('../db')
cooldown = false
module.exports = {
    run: (message, client) => {
        function emb(user, commande, messag, titre, couleur) {
            embed = new discord.MessageEmbed()
            .setColor(`${couleur}`)
            .setTitle(`${titre}`)
        
            .setDescription(`${messag} 

${user}`)
            .setFooter(`Update ${commande}
            `)
            return embed
        }

        userId = message.author.id

        // Fonction qui s'actualise chaque 3s pour vérifier certaines conditions
        function base() {

            // Augmentation de niveau selon xp
            db.query(`SELECT id, xp, niveau, pseudo FROM utilisateur`, async function (err, result) {
                if (err) throw err;
                if(result.length == 0) return message.channel.send("pb .start")
                tab = []
                for(i = 0; i < result.length; i++) tab.push([result[i].id, result[i].xp, result[i].niveau, result[i].pseudo])

                for(i = 0; i < tab.length; i++) {
                    if(tab[i][1] >= 20 * tab[i][2]) {
                        message.channel.send(`${tab[i][3]} Vous venez de passer au niveau ${tab[i][2] + 1} !`)
                        db.query(`UPDATE utilisateur SET xp = '${tab[i][1] - 20 * tab[i][2]}', niveau = '${tab[i][2] + 1}' WHERE id = '${tab[i][0]}'`, function (err2, result2) {
                            if(err2) throw err2
                        });
                    }
                }

                // Vérification des collections
                collection1 = [23, 1000]
                collection2 = [28, 1]

                let compteurd = 0
                for(i = 0; i < tab.length; i++) {
                    let tabPersos = []
                    let indice = tab[i][0]
                    db.query(`SELECT personnage FROM spawn WHERE utilisateur = '${indice}'`, async function (err2, result2) {
                        compteurd++
                        if(err2) throw err2
                        for(j = 0; j < result2.length; j++) tabPersos.push(result2[j].personnage)
                        let collec =  []

                        if(collection1.every(k => tabPersos.includes(k))) collec.push(1)
                        if(collection2.every(k => tabPersos.includes(k))) collec.push(2)
                        if(collec.length == 0) return
                        else {
                            let compteurS = 0
                            for(let s = 0; s < collec.length; s++) {
                               await db.query(`SELECT * FROM collectionutilisateur WHERE utilisateur = '${indice}' AND collection = '${collec[s]}'`, async function (err3, result3) {
                                if(err3) throw err3
                                compteurS++
                                
                                if(result3.length == 0) {
                                await db.query(`INSERT INTO collectionutilisateur(utilisateur, collection) VALUES('${indice}', '${collec[compteurS-1]}')`, async function (err4, result4) {
                                    if(err4) throw err4
                                    message.channel.send((emb(message.author, "", `Vous avez complété la collection n°${collec[compteurS-1]}`, "", "YELLOW")))
                                });
                            }
                            });
                        }
                    }
                    });
                    
                }
                

            });

        setTimeout(() => {
            base()
        }, 3000);
    }
    base()

        
            
    },
    name: 'start'
}