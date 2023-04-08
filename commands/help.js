const Discord = require('discord.js')
const pagination = require('discord.js-pagination')
module.exports = {
    run: (message) => {
       
        pages = [
            new Discord.MessageEmbed()
            .setTitle("Help - Bases")
            .setColor("BLACK")
            .setDescription(`addu : S'enregistrer sur le bot
            
help : Voir la liste des commandes disponibles

profile : Voir son profil

daily : Recevoir son bonus de coins (toutes les 24h)

dailyperso : Recevoir son personnage (toutes les 24h)`),

            
        new Discord.MessageEmbed()
        .setTitle("Help - Personnages")
        .setColor("BLACK")
        .setDescription(`spawn : Fait spawn un personnage aléatoire (toutes les 60-75mn)

claim [nom] : Claim le dernier personnage spawn

list : Affiche la liste des personnages possédés 

view [n°] : Affiche un personnage détaillé 

train [n° personnage] [thème] : Entraîne un personnage pour améliorer ses stats

fight [@utilisateur] [thème] [coins pariés] : Permet d'affronter un utilisateur sur un domaine donné en choisissant chacun un personnage.`),

        new Discord.MessageEmbed()
        .setTitle("Help - Achats")
        .setColor("BLACK")
        .setDescription(`spawn : Fait spawn un personnage aléatoire (toutes les 60-75mn)

shopperso : Affiche le menu d'achat des des personnages

shopbadges : Affiche le menu d'achat des des badges

shopbonus : Affiche le menu d'achat des des bonus 

buy [type] [n°] : Achète un item (perso, badge ou bonus)

bonus : Affiche les bonus possédés
        
badges : Affiche les badges possédés
        
setbadges [n° badge] : Affiche un badge sur son profil`)
        ]



        let emojis = ["⬅️", "➡️"]
            const timeout = '100000000'
            pagination(message, pages, emojis, timeout)

    },
    name: 'help'
}