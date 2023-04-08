const discord = require('discord.js');
const db = require('../db');
module.exports = {
    run: async (message) => {

        
        await db.query(`SELECT id, xp, niveau, pseudo FROM utilisateur`, async function (err, result) {
            if (err) throw err;
                if(result.length == 0) return message.channel.send("pb .start")
                tab = []
                for(i = 0; i < result.length; i++) tab.push([result[i].id, result[i].xp, result[i].niveau, result[i].pseudo])

                for(i = 0; i < tab.length; i++) {
                    indice = tab[i][0]
                    console.log(`SELECT personnage FROM spawn WHERE utilisateur = '${indice}'`)
                    await db.query(`SELECT personnage FROM spawn WHERE utilisateur = '${indice}'`, async function (err2, result2) {
                        if(err2) throw err2
                        tabPersos = []
                        for(j = 0; j < result2.length; j++) tabPersos.push(result2[j].personnage)
                    console.log(tabPersos)
                    
                });
            }
        });
        
    },
    name: 'test'
}