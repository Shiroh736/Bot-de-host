const { EmbedBuilder, ButtonBuilder, ChannelType, ApplicationCommandType, ComponentType, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle } = require('discord.js');
const { JsonDatabase } = require("wio.db");
const emoji = require('../../config/emojis.json');
const users = new JsonDatabase({ databasePath: `${__dirname}/../../db/users.json` });
const planoss = new JsonDatabase({ databasePath: `${__dirname}/../../db/planos.json` });


module.exports = {
    name: 'up',
    description: 'Upar seu bot para hospedagem',
    type: ApplicationCommandType.ChatInput,

    run: async ({ client, interaction }) => {
        const user = users.get(interaction.user.id)
        const hasTicket = client.tickets.get(interaction.user.id);

        if (hasTicket) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Atalho Thread')
                        .setURL(hasTicket)
                );
        }
        if (!user) return interaction.reply('voce nao esta registado na nossa data base utilize /registrar para se registrar')
        const guild = client.guilds.cache.get('1058618124196401172');
        const channel = guild.channels.cache.get('1067019164298002472');
        const thread = await channel.threads.create({
            name: `thread-${interaction.user.username}`,
            autoArchiveDuration: 60,
            type: ChannelType.PrivateThread,
            reason: 'threads upload',
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.SendMessages],},
            ],
        })
        console.log(`[UPLOAD] ${interaction.user.username}#${interaction.user.discriminator} Iniciou o processo de Hospedagem`)
        await thread.members.add(`${interaction.user.id}`)
        
        .then(c => {
            const ticketChannel = `https://discord.com/channels/${interaction.guild.id}/${thread.id}`
            client.tickets.set(interaction.user.id, ticketChannel);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${emoji.success} | **Thread** aberta com sucesso!`)
                        .setColor('#ffffff')
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            new ButtonBuilder()
                                .setStyle('Link')
                                .setLabel('Thread')
                                .setEmoji(emoji.loading)
                                .setURL(ticketChannel)
                        ]
                    }
                ]
            
            });
                thread.send({
                content: `${interaction.user}`,
                embeds: [
                    new EmbedBuilder()
                        .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")
                        .setDescription(`** ${emoji.loading} | Informe o \`\`apelido\`\` do seu bot\n ${emoji.loading} | Informe a \`\`linguagem\`\` do seu bot.\n ${emoji.loading} | Informe a \`\`ram\`\` que voce vai ultilizar \n ${emoji.loading} | Envie o \`\`anexo\`\` contendo os arquivos do seu bot**`)
                        .setColor('#ffffff')
                ],
            }).then(msg => {
                const filter = (i) => i.author.id == interaction.user.id;

                msg.channel.createMessageCollector({ filter, max: 1 })

                    .on("collect", async (interaction) => {
                        const ap = interaction.content;

                        const embedd = new EmbedBuilder()
                            .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")
                            .setDescription(`Informe a Linguagem de programação da sua aplicação`)
                            .setColor('#ffffff')

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('select')
                                    .setPlaceholder('Escolha a linguagem')
                                    .addOptions(
                                        {
                                            label: 'Javascipt',
                                            description: 'Linguagem de programação Javascipt',
                                            emoji: '1056673918791974942',
                                            value: 'Javascipt',
                                        }
                                    ),
                            );

                        msg.edit({
                            content: `${interaction.author}`,
                            embeds: [
                                new EmbedBuilder()
                                    .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")
                                    .setDescription(`** ${emoji.success} | Informe o \`\`apelido\`\` do seu bot: ${ap}\n ${emoji.loading} Informe a \`\`linguagem\`\` do seu bot.\n ${emoji.loading} | Informe a \`\`ram\`\` que voce vai ultilizar \n ${emoji.loading} | Envie o \`\`anexo\`\` contendo os arquivos do seu bot**`)
                                    .setColor('#ffffff')
                            ],
                        })
                        await interaction.delete()
                        interaction.channel.send({ embeds: [embedd], components: [row] }).then(msg2 => {
                            const filter = (i) => i.user.id == interaction.author.id;

                            msg2.channel.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, max: 1 })

                                .on("collect", async (interaction) => {
                                    msg2.delete()
                                    const linguagem = interaction.values[0];

                                    msg.edit({
                                        content: `${interaction.user}`,
                                        embeds: [
                                            new EmbedBuilder()
                                                .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")
                                                .setDescription(` **${emoji.success} | Informe o \`\`apelido\`\` do seu bot: ${ap}\n ${emoji.success} | Informe a \`\`linguagem\`\` do seu bot: ${linguagem}\n ${emoji.loading} | Informe a \`\`ram\`\` que voce vai ultilizar: \n\n ${emoji.loading} | Envie o \`\`anexo\`\` contendo os arquivos do seu bot**`)
                                                .setColor('#ffffff')
                                        ],
                                    })

                                    const embed23 = new EmbedBuilder()
                                        .setTitle('Informe a ram que voce vai ultilizar')
                                        .setDescription(`Disponivel: ${user.ram - planoss.get(`${user.plano}`).memory} MB`)
                                        .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")


                                    interaction.channel.send({ embeds: [embed23] }).then(msg3 => {
                                        const filter = (i) => i.author.id == interaction.user.id;

                                        const coletor = msg3.channel.createMessageCollector({ filter })

                                        coletor.on("collect", async (interaction) => {
                                            msg3?.delete()
                                            interaction?.delete()
                                            const ram = interaction.content;

                                            if (!Number(ram)) return interaction.reply('so pode numeros')
                                            if (ram > 512 || ram < 10) return interaction.reply(`Escolha um numero de 10 ate 512`)
                                            if (planoss.get(`${user.plano}`).memory > user.ram + ram) return  await interaction.channel.send({ content: 'seu limite de ram ja foi excedido', ephemeral: true }).then(setTimeout(async () => {interaction.channel.delete();}, 5000))
                                            users.add(`${interaction.author.id}.ram`, Number(ram))

                                            msg.edit({
                                                content: `${interaction.author}`,
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")
                                                        .setDescription(` **${emoji.success} | Informe o \`\`apelido\`\` do seu bot: ${ap}\n ${emoji.success} | Informe a \`\`linguagem\`\` do seu bot: ${linguagem}\n ${emoji.success} | Informe a \`\`ram\`\` que voce vai ultilizar: ${ram}\n ${emoji.loading} | Envie o \`\`anexo\`\` contendo os arquivos do seu bot**`)
                                                        .setColor('#ffffff')
                                                ],
                                            })

                                            coletor.stop();
                                            interaction.channel.send('mande seu arquivo').then(msg4 => {
                                                const filter = (i) => i.author.id == interaction.author.id;

                                                msg4.channel.createMessageCollector({ filter })

                                                    .on("collect", async (interaction) => {

                                                        msg4?.delete()
                                                        const attachments = interaction.attachments.first();
                                                        if (!attachments) return interaction.reply('mande o arquivo novamente')
                                                        if (attachments.contentType !== 'application/zip') return interaction.reply({ content: 'mande seu bot em .zip' })

                                                        msg.edit({
                                                            content: `${interaction.author}`,
                                                            embeds: [
                                                                new EmbedBuilder()
                                                                    .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")
                                                                    .setDescription(`** ${emoji.success} | Informe o \`\`apelido\`\` do seu bot: ${ap}\n ${emoji.success} | Informe a \`\`linguagem\`\` do seu bot: ${linguagem}\n ${emoji.success} | Informe a \`\`ram\`\` que voce vai ultilizar: ${ram}\n ${emoji.success} | Envie o \`\`anexo\`\` contendo os arquivos do seu bot**`)
                                                                    .setColor('#ffffff')
                                                            ],
                                                        })

                                                        const res = await client.pyteroAPI.discordjs(interaction.author.id, user.plano === "free" ? `${user.plano} ${ap}` : ap, ram, planoss.get(`${user.plano}`).disk, planoss.get(`${user.plano}`).cpu);
                                                        
                                                        const embed24 = new EmbedBuilder()
                                                            .setTitle(`${emoji.loading} **| Seu bot está sendo hospedado**`)
                                                            .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")
                                                            .setDescription(`Aguarde alguns minutos para que seu bot seja hospedado`)
                                                            .setColor('#ffffff')
                                                        interaction.reply({ embeds: [embed24]})

                                                        setTimeout(async () => {
                                                            await client.pyteroAPI.uploadfile(res.identifier, attachments.url);
                                                            const file = attachments.url.split('/')[6];

                                                            await client.pyteroAPI.descompressfile(res.identifier, file);
                                                            await client.pyteroAPI.deletefile(res.identifier, file);
                                                            await client.pyteroAPI.serverstart(res.identifier);

                                                            const embed25 = new EmbedBuilder()
                                                                .setTitle(`${emoji.success} | Seu bot foi hospedado com sucesso`)
                                                                .setDescription('Essa thread será deletada em 30 segundos')
                                                                .setThumbnail("https://media.discordapp.net/attachments/1059340373970923541/1067020466038001784/626a7530d62ac03ca4ab38eb49da02e4.png")
                                                                .setColor('#ffffff')
                                                            interaction.reply({ embeds: [embed25] })
                                                            await thread.members.remove(`${interaction.author.id}`);
                                                            console.log(`[UPLOAD] Aplicação ${ap} hospedado com sucesso por ${interaction.author.username}#${interaction.author.discriminator} (${interaction.author.id})`)
                                                            setTimeout(async () => {
                                                                thread.delete()
                                                                .then(() => {
                                                                  console.log(`A Thread de ${interaction.author.username} foi deletado!`);
                                                                })
                                                                .catch(err => {
                                                                  console.log(err);
                                                                });
                                                            }, 30000);
                                                        }, 60000);
                                                    })
                                            })
                                        })
                                    })

                                })
                        })

                    })
            })
        })
    }
}