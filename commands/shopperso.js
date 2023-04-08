const discord = require('discord.js')
module.exports = {
    run: (message) => {

            let embed = new discord.MessageEmbed()
            .setTitle("Shop - Persos")
            .setDescription(`1. Personnage Commun - 200 coins

2. Personnage Rare - 200 coins

3. Personnage Ultra rare - 200 coins

4. Personnage Epique - 200 coins

5. Personnage Légendaire - 200 coins`)

            message.channel.send(embed)
     
    },
    name: 'shopperso'
}