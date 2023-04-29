const client = require('../../index')

client.on("interactionCreate", async (interaction) => {

  if (interaction.isChatInputCommand()) {
    const cmd = client.slash.get(interaction.commandName);
    if (!cmd) return;

    const args = [];
    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);

        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(interaction.user.id);
    interaction.guild = client.guilds.cache.get(interaction.guildId);

    cmd.run({ client, interaction, args });
  }

  if (interaction.isContextMenuCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run({ client, interaction });
  }
});