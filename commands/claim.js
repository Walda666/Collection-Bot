const db = require('../db')
const discord = require('discord.js')
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

        if(args.length != 1) {
            return message.channel.send(emb(message.author, message, "Veuillez mettre le nom du personnage", "ERREUR", "RED"))
        } 
        nomPropose = args[0]
        db.query(`SELECT S.id, P.nom, S.utilisateur FROM spawn S JOIN personnage P ON P.id = S.personnage ORDER BY S.id DESC`, function (err, result) {
            if(result.length == 0) return
            if (err) throw err;
            nomSpawn = result[0].nom
            utilisateurSpawn = result[0].utilisateur
            idSpawn = result[0].id
            if(utilisateurSpawn != null) return
            if(nomPropose.toLowerCase() == nomSpawn.toLowerCase()) {
                db.query(`SELECT id FROM utilisateur WHERE id_discord = '${message.author.id}'`, function (err2, result2) {
                    if (err2) throw err2;
                    idUserDb = result2[0].id

                    db.query(`SELECT S.idByUser FROM spawn S JOIN utilisateur U ON S.utilisateur = U.id WHERE U.id_discord = '${message.author.id}' ORDER BY S.idByUser DESC`, function (err4, result4) {
                        if(result4.length == 0) return
                        if(err4) throw err4;         
                        tableau = []
                        for(i = 0; i < result4.length; i++) tableau.push(result4[i].idByUser)
                        if(tableau.length == 0) count = 1          
                        else count = tableau[0] + 1

                        db.query(`UPDATE spawn SET utilisateur = '${idUserDb}', idByUser = '${count}' WHERE id = '${idSpawn}'`, function (err3, result3) {
                            if(err3) throw err3;
                            return message.channel.send(emb(message.author, message, `Vous possédez désormais ${nomSpawn}`, "", "GREEN"))
                        });
                 });
            });
        }}); 
                
    },
    name: 'claim'
}