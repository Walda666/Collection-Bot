db = require('../db')
module.exports = {
    run: (message, args) => {
        
        db.query(`SELECT id_discord FROM utilisateur`, function (err, result) {
            if (err) throw err;
            let tab = []
            for(let $i = 0; $i < result.length; $i++) tab.push(result[$i].id_discord)
                if(tab.includes(message.author.id)) {
                    message.channel.send(`${message.author} Vous êtes déjà inscrit`)
                } else {
                    db.query(`INSERT INTO utilisateur(id_discord, pseudo, niveau, xp, balance) VALUES ('${message.author.id}', '${message.author.username}', '1', '0', '0')`, function (err, result) {
                        if (err) throw err;
                        message.channel.send(`${message.author} Vous vous êtes inscrit avec succès, bonne collection !`)
                    });
                }
            });     
    },
    name: 'addu'
}