const { EmbedBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const { JsonDatabase } = require("wio.db");
const users = new JsonDatabase({ databasePath: `${__dirname}/../../db/users.json` });
const planoss = new JsonDatabase({ databasePath: `${__dirname}/../../db/planos.json` });

module.exports = {
  name: 'profile',
  description: ' Ver Suas Informações',
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    const user = users.get(interaction.user.id)
    if (!user) return interaction.reply('voce nao esta registado na nossa data base utilize /registrar para se registrar')
    const servers = await client.pyteroAPI.getservers();
    const a = servers.data.filter(e => e.attributes.description.includes(interaction.user.id));
    const plano = users.get(interaction.user.id)
    const cu = planoss.get(`${plano.plano}.memory`)
    const ram = users.get(`${interaction.user.id}.ram`)
    
    
    const embed = new EmbedBuilder()
      .setDescription(`
**<:user:1061066574410289263> | Nível:**
Gratuito

**🇧🇷 | Idioma:**
Português

**<:nao:1061000398011371530> | Blocklist**
Não

**<:nuvem:1061080910591709215> | Bots**
${a?.length}

**<:infor:1061000209536131072> | Memória**
${ram}/${cu}MB`)
      .setColor("ffffff")

    if (plano.plano === 'free') return interaction.reply({ embeds: [embed] });

    const Embed = new EmbedBuilder()
      .setDescription(`
**<:user:1061066574410289263> | Nível:**
${plano.plano} ( <t:${parseInt(plano.date / 1000)}:R> )

**🇧🇷 | Idioma:**
Português

**<:nao:1061000398011371530> | Blocklist**
Não

**<:nuvem:1061080910591709215> | Bots**
${a?.length}

**<:infor:1061000209536131072> | Memória**
${ram}/${cu}MB`)
      .setColor("ffffff")

    if (plano.plano !== 'free') return interaction.reply({ embeds: [Embed] })


  }
}