const { EmbedBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'clear',
    description: 'limpar chat',
    type: ApplicationCommandType.ChatInput,
    
    run: async({ client, interaction }) => {
        if (!config.owners.includes(interaction.user.id)) return interaction.reply({ content: "<:s_nao:1047273501507203083> | Você não está na lista de pessoas!", ephemeral: true })
        
        let m = await interaction.channel.messages.fetch({ limit: 100 })
        await interaction.channel.bulkDelete(m).then((x) => {
            interaction.reply({ content: `mensagens deletadas!`, ephemeral: true })
		}).catch((e) => {
            interaction.reply({ content: `nao foi possivel limpar!`, ephemeral: true })
        })
	}
}