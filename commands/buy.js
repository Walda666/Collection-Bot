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

        userId = message.author.id
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();;

        
        if(args.length != 2) return message.channel.send(emb(message.author, message, "Veuillez rentrer le type (badge/bonus/perso) et l'item voulu", "ERREUR", "RED"))
        typeArg = args[0]
        idArg = args[1]

        db.query(`SELECT id, balance FROM utilisateur WHERE id_discord = '${userId}'`, function (err0, result0) {
            if(result0.length == 0) return
            if(err0) throw err0
            idUser = result0[0].id
            balanceUser = result0[0].balance
        
            if(typeArg == "badge") {
                
                db.query(`SELECT prix, nom FROM badge WHERE idShop = '${idArg}'`, function (err, result) {
                    if(result.length == 0) return
                    if (err) throw err;
                    if(balanceUser < result[0].prix)  return message.channel.send(emb(message.author, message, "Vous n'avez pas assez de coins pour acheter cet item", "ATTENTION", "ORANGE"))
                    prixBadge = result[0].prix
                    nomBadge = result[0].nom

                    db.query(`SELECT idByUser FROM badgeutilisateur WHERE utilisateur = ${idUser} ORDER BY idByUser DESC`, function (err2, result2) {
                        if(err2) throw err2;         
                        tableau = []
                        for(i = 0; i < result2.length; i++) tableau.push(result2[i].idByUser)
                        if(tableau.length == 0) idByUserBadge = 1          
                        else idByUserBadge = tableau[0] + 1

                        db.query(`INSERT INTO badgeutilisateur(badge, utilisateur, date, surProfil, idByUser) VALUES('${idArg}', '${idUser}', '${date}', '0', '${idByUserBadge}')`, function (err, result) {
                        });
                        db.query(`UPDATE utilisateur SET balance = balance - ${prixBadge} WHERE id = '${idUser}'`, function (err, result) {
                        if(err) throw err
                        });
                        message.channel.send(emb(message.author, message, `Vous avez bien acheté le badge ${nomBadge}\n Vous pouvez consulter vos badges en faisant .badges ou en mettre un sur votre profil avec .setbadge`, "", "GREEN"))
                    });
                });

            } else if(typeArg == "bonus") {

                db.query(`SELECT prix, nom FROM bonus WHERE id = '${idArg}'`, function (err, result) {
                    if(result.length == 0) return
                    if (err) throw err;
                    if(balanceUser < result[0].prix) return message.channel.send(emb(message.author, message, "Vous n'avez pas assez de coins pour acheter cet item", "ATTENTION", "ORANGE"))
                    prixBonus = result[0].prix
                    nomBonus = result[0].nom

                    db.query(`SELECT idByUser FROM bonusutilisateur WHERE utilisateur = ${idUser} ORDER BY idByUser DESC`, function (err2, result2) {
                        if(err2) throw err2;         
                        tableau = []
                        for(i = 0; i < result2.length; i++) tableau.push(result2[i].idByUser)
                        if(tableau.length == 0) idByUserBonus = 1          
                        else idByUserBonus = tableau[0] + 1

                        db.query(`INSERT INTO bonusutilisateur(bonus, utilisateur, date, idByUser) VALUES('${idArg}', '${idUser}', '${date}', '${idByUserBonus}')`, function (err, result) {
                        });
                        db.query(`UPDATE utilisateur SET balance = balance - ${prixBonus} WHERE id = '${idUser}'`, function (err, result) {
                        if(err) throw err
                        });
                        message.channel.send(emb(message.author, message, `Vous avez bien acheté le bonus '${nomBonus}'\n Vous pouvez consulter vos bonus en faisant .bonus`, "", "GREEN"))
                    });
                });                

            } else if(typeArg == "perso") {

                db.query(`SELECT * FROM personnage`, function (err, result) {
                    if (err) throw err;
                    let tab = []
                    for(let $i = 0; $i < result.length; $i++) tab.push([result[$i].id, result[$i].nom, result[$i].description, result[$i].image])
                    const perso = tab[(Math.floor(Math.random() * tab.length))]
                    if(idArg == 1) {
                        rareteString = "Commun"
                        prixPerso = 200
                    } else if(idArg == 2) { 
                        rareteString = "Rare"
                        prixPerso = 400
                    } else if(idArg == 3) { 
                        rareteString = "Ultra rare"
                        prixPerso = 800
                    } else if(idArg == 4) { 
                        rareteString = "Epique"
                        prixPerso = 1000
                    } else if(idArg == 5) { 
                        rareteString = "Légendaire"
                        prixPerso = 2000
                    } else {
                        rareteString = "NaN"
                        prixPerso = 9999999999
                    }

                    desc = ""
                    if(perso[2] != "NULL")  desc = perso[2]
    
                    embedPerso = new discord.MessageEmbed()
                    .setTitle(perso[1])
                    .setDescription(`${desc}
    ${rareteString}`)
                    .setImage(perso[3])
                    .setColor(colors[rareteString])
                    .setFooter(`Shop Perso - ${message.author.username}`)
                    
                    db.query(`SELECT id, balance FROM utilisateur WHERE id_discord = '${message.author.id}'`, function (err2, result2) {
                        if(err2) throw err2;
                        utilisateur = result2[0].id
                        balanceUser = result2[0].balance

                        if(balanceUser < prixPerso) return message.channel.send(emb(message.author, message, "Vous n'avez pas assez de coins pour acheter cet item", "ATTENTION", "ORANGE"))

                        message.channel.send(embedPerso)
    
                        db.query(`SELECT S.idByUser FROM spawn S JOIN utilisateur U ON S.utilisateur = U.id WHERE U.id_discord = '${message.author.id}' ORDER BY S.idByUser DESC`, function (err4, result4) {
                            if(err4) throw err4;         
                            tableau = []
                            for(i = 0; i < result4.length; i++) tableau.push(result4[i].idByUser)
                            if(tableau.length == 0) count = 1          
                            else count = tableau[0] + 1
    
                            db.query(`INSERT INTO spawn(personnage, utilisateur, rarete, etat, stat_mc, stat_lol, stat_humour, idByUser) VALUES ('${perso[0]}', '${utilisateur}', '${rareteString}', '0', '0', '0', '0', '${count}')`, function (err, result) {
                                });
                            db.query(`UPDATE utilisateur SET balance = balance - ${prixPerso} WHERE id = '${idUser}'`, function (err, result) {
                                if(err) throw err
                                });
                         });
                     });
                  });
                            
            } else {
                return message.channel.send(emb(message.author, message, "Veuillez rentrer un type valide (badge/bonus/perso)", "ERREUR", "RED"))
            }

        });
    },
    name: 'buy'
}