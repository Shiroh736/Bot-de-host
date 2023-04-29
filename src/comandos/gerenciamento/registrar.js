const { EmbedBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const { JsonDatabase } = require("wio.db");
const users = new JsonDatabase({ databasePath: `${__dirname}/../../db/users.json` });

module.exports = {
    name: 'registrar',
    description: 'registra voce',
    type: ApplicationCommandType.ChatInput,
    
    run: async({ client, message, interaction }) => {
        const user = users.get(interaction.user.id)
        const verify = users.get(interaction.user.id)
       
        if (verify) {
            const embed = new EmbedBuilder()
            .setTitle('Você já está registrado!')
            .setDescription('Você já está registrado, não é necessário registrar novamente!')
            interaction.reply({ embeds: [embed] })
            console.log(`[REGISTRO] ${interaction.user.username}#${interaction.user.discriminator} tentou se registrar novamente!`)
        } 
        
        if (!verify) {
            users.set(interaction.user.id, {
                id: interaction.user.id,
                date: 0,
                hasVip: false,
                plano: "free",
                ram: 0
            })
            const embed = new EmbedBuilder()
            .setTitle('Registrado com sucesso!')
            .setDescription('Você foi registrado e recebeu o seu plano Gratuito, caso queira comprar outro plano, compre.')
            interaction.reply({ embeds: [embed] })
            console.log(`[REGISTRO] ${interaction.user.username}#${interaction.user.discriminator} foi registrado!`)
        }
	}
}