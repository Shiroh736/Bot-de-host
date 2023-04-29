const { EmbedBuilder, ButtonBuilder, ChannelType, ApplicationCommandType, ComponentType, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
const formatBytes = require('../../modules/api/formatBytes')
const moment = require("moment")
require("moment-duration-format");
const { JsonDatabase } = require("wio.db");
const users = new JsonDatabase({ databasePath: `${__dirname}/../../db/users.json` });
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'apps',
    description: 'veja seus servidores',
    type: ApplicationCommandType.ChatInput,

    run: async ({ client, interaction }) => {

        const servers = await client.pyteroAPI.getservers();
        const user = users.get(interaction.user.id);
        const a = servers.data.filter(e => e.attributes.description.includes(interaction.user.id));
      

        if (!user) {
            return interaction.reply('You do not have register, use /registrar to register.').catch(() => {
                // error handling code here
                });
        }
        
        if (!a.length) {
            return interaction.reply('You do not have any apps, use /up to up a app.').catch(() => {
                // error handling code here
                });
        }
        const ordersMenu = a.map(order => {
            order = order.attributes;

            return {
                label: `${order.name?.replace("free", "")}`,
                value: order.identifier,
                emoji: '1054167786651390043'
            }
        })

        let row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder({
                    placeholder: "Selecione o servidor",
                    customId: "selectordershipmenty",
                    options: ordersMenu,
                })
            );

        return interaction.reply({ components: [row] })
            .then(m => {
                const filter = (i) => i.customId == "selectordershipmenty" && i.user.id == interaction.user.id;

                m.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, idle: 120000 })
                    .on("collect", async (interaction) => {
                        const identifier = interaction.values[0];
                        if (identifier === 'nada') return interaction.reply({ content: 'você não tem bots hospedados use /up para upa seu bot', ephemeral: true })

                        const commit = new ButtonBuilder()
                            .setCustomId(`commit_${identifier}`)
                            .setLabel('Commit')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary)

                        const listfiles = new ButtonBuilder()
                            .setCustomId(`listfiles_${identifier}`)
                            .setLabel('Mostrar arquivos')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary)


                        const upload = new ButtonBuilder()
                            .setCustomId(`upload_${identifier}`)
                            .setLabel('Upload')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary)

                        const apagar = new ButtonBuilder()
                            .setCustomId(`apagar_${identifier}`)
                            .setLabel('Apagar')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary)

                        const ligar = new ButtonBuilder()
                            .setCustomId(`ligar_${identifier}`)
                            .setLabel('Ligar')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Success)

                        const desligar = new ButtonBuilder()
                            .setCustomId(`desligar_${identifier}`)
                            .setLabel('Desligar')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Danger)

                        const reiniciar = new ButtonBuilder()
                            .setCustomId(`reiniciar_${identifier}`)
                            .setLabel('Reiniciar')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Primary)

                        const download = new ButtonBuilder()
                            .setCustomId(`download_${identifier}`)
                            .setLabel('Download')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary)

                        let a = await client.pyteroAPI.getserver(identifier)
                        let servers = await client.pyteroAPI.getserver(identifier);
                        let servers_1 = await client.pyteroAPI.getservera(identifier);
                        servers_1 = servers_1.attributes.resources;
                        servers = servers.attributes.limits;

                        let botao = [];
                        if (servers_1.uptime === 0) {
                            botao.push(new ActionRowBuilder().setComponents([ligar, download, upload, commit]));
                            botao.push(new ActionRowBuilder().addComponents([listfiles, apagar]));
                        } else {
                            botao.push(new ActionRowBuilder().addComponents([desligar, reiniciar, download, upload, commit]));
                            botao.push(new ActionRowBuilder().addComponents([listfiles, apagar]));
                        }

                        const Embed = new EmbedBuilder()
                            .setTitle(`Info sobre o servidor - ${a.attributes.name?.replace("free", "")}`)
                            .setDescription(`**Status**: ${servers_1.uptime === 0 ? "Desligado" : "Ligado"}\n**UPtime**: ${moment.duration(servers_1.uptime).format("y [anos] M [meses] d [dias] h [horas] m [minutos] e s [segundos]").replace("minsutos", "minutos")}\n\n**Uso de memoria ram**: ${formatBytes(servers_1.memory_bytes)}/${servers.memory} MB\n**Uso do Disco**: ${formatBytes(servers_1.disk_bytes)}/${servers.disk} MB\n**Uso do CPU**: ${servers_1.cpu_absolute}%/${servers.cpu}%\n\n**Recebimento de dados**: ${formatBytes(servers_1.network_rx_bytes)}\n**Envio de dados**: ${formatBytes(servers_1.network_tx_bytes)}`)
                            .setColor(0x0099FF)

                        interaction.reply({ embeds: [Embed], components: botao }).then(m => {
                            const filter = (i) => i.user.id == interaction.user.id;

                            m.createMessageComponentCollector({ filter, componentType: ComponentType.Button, idle: 120000 })
                                .on("collect", async (interaction) => {
                                    const button = interaction.customId;

                                    await interaction.deferUpdate();

                                    if (button.startsWith('ligar_')) {
                                        const [, identifier] = button.split('_')

                                        let getserver_2 = await client.pyteroAPI.getserver(identifier);
                                        let getserver_3 = await client.pyteroAPI.getservera(identifier);

                                        getserver_3 = getserver_3.attributes.resources;
                                        getserver_2 = getserver_2.attributes.limits;

                                        await client.pyteroAPI.serverstart(identifier)

                                        const Embed5 = new EmbedBuilder()
                                            .setTitle(`Info sobre o servidor - ${a.attributes.name?.replace("free", "")}`)
                                            .setDescription(`**Status**: ${getserver_3.uptime === 0 ? "Desligado" : "Ligado"}\n**UPtime**: ${moment.duration(getserver_3.uptime).format("y [anos] M [meses] d [dias] h [horas] m [minutos] e s [segundos]").replace("minsutos", "minutos")}\n\n**Uso de memoria ram**: ${formatBytes(getserver_3.memory_bytes)}/${getserver_2.memory} MB\n**Uso do Disco**: ${formatBytes(getserver_3.disk_bytes)}/${getserver_2.disk} MB\n**Uso do CPU**: ${getserver_3.cpu_absolute}%/${getserver_2.cpu}%\n\n**Recebimento de dados**: ${formatBytes(getserver_3.network_tx_bytes)} MB\n**Envio de dados**: ${formatBytes(getserver_3.network_tx_bytes)} MB`)
                                            .setColor(0x0099FF)

                                        ligar.setDisabled(true)

                                        interaction.editReply({ embeds: [Embed5], components: botao })

                                        interaction.followUp('Servidor ligado com sucesso')
                                    }

                                    if (button.startsWith('desligar_')) {

                                        const [, identifier] = button.split('_')
                                        let getserver_2 = await client.pyteroAPI.getserver(identifier);
                                        let getserver_3 = await client.pyteroAPI.getservera(identifier);

                                        getserver_3 = getserver_3.attributes.resources;
                                        getserver_2 = getserver_2.attributes.limits;

                                        await client.pyteroAPI.serverstop(identifier)

                                        const Embed2 = new EmbedBuilder()
                                            .setTitle(`Info sobre o servidor - ${a.attributes.name?.replace("free", "")}`)
                                            .setDescription(`**Status**: ${getserver_3.uptime === 0 ? "Desligado" : "Ligado"}\n**UPtime**: ${moment.duration(getserver_3.uptime).format("y [anos] M [meses] d [dias] h [horas] m [minutos] e s [segundos]").replace("minsutos", "minutos")}\n\n**Uso de memoria ram**: ${formatBytes(getserver_3.memory_bytes)}/${getserver_2.memory} MB\n**Uso do Disco**: ${formatBytes(getserver_3.disk_bytes)}/${getserver_2.disk} MB\n**Uso do CPU**: ${getserver_3.cpu_absolute}%/${getserver_2.cpu}%\n\n**Recebimento de dados**: ${formatBytes(getserver_3.network_tx_bytes)}\n**Envio de dados**: ${formatBytes(getserver_3.network_tx_bytes)}`)
                                            .setColor(0x0099FF)

                                        desligar.setDisabled(true)

                                        await interaction.editReply({ embeds: [Embed2], components: botao })

                                        await interaction.followUp('Servidor desligado com sucesso')
                                    }

                                    if (button.startsWith('apagar_')) {
                                        const [, identifier] = button.split('_')

                                        let getserver_1 = await client.pyteroAPI.getserver(identifier).catch(e => console.log(e))
                                        let getserver_2 = await client.pyteroAPI.getserver(identifier).catch(e => console.log(e));
                                        let getserver_3 = await client.pyteroAPI.getservera(identifier).catch(e => console.log(e));

                                        getserver_3 = getserver_3.attributes.resources;
                                        getserver_2 = getserver_2.attributes.limits;


                                        let files;
                                        files = await client.pyteroAPI.listfiles(identifier).catch(e => console.log(e))
                                        files = files.data;
                                        
										if (!files.length) return await client.pyteroAPI.serverdel(getserver_1.attributes.internal_id)
                                        
                                        const npode = ['.npm', 'node_modules']

                                        const object = Object?.values(files.filter(x => !npode.includes(x.attributes.name)))
                                        const objecta = Object?.values(object.filter(x => x.attributes.name))
                                        const arrar = objecta.map(x => x.attributes.name)

                                        const compressfile = await client.pyteroAPI.compressfile(identifier, arrar).catch(e => console.log(e))

                                        const downloadfile = await client.pyteroAPI.downloadfile(identifier, compressfile.attributes.name).catch(e => console.log(e))

                                        const Embed9 = new EmbedBuilder()
                                            .setDescription(`Download gerado com sucesso clique [aqui](${downloadfile.attributes.url}) para baixar, valido por 1 minuto!!`)
                                            .setColor(0x0099FF)

                                        await client.users.cache.get(interaction.user.id).send({ embeds: [Embed9], components: [] }).catch(e => console.log(e))
                                        await wait(2000);
                                        await client.users.cache.get(interaction.user.id).send({ embeds: [Embed9], components: [] }).catch(e => console.log(e))

                                        setTimeout(async () => await client.pyteroAPI.serverdel(getserver_1.attributes.internal_id).catch(e => console.log(e)), 60000);
                                        console.log(`[SISTEMA] A conta ${interaction.user.username} (${interaction.user.id}) apagou o servidor ${getserver_1.attributes.name} com sucesso!`)
                                    }

                                    if (button.startsWith('listfiles_')) {
                                        const [, identifier] = button.split('_')

                                        let getserver_2 = await client.pyteroAPI.getserver(identifier);
                                        let getserver_3 = await client.pyteroAPI.getservera(identifier);

                                        getserver_3 = getserver_3.attributes.resources;
                                        getserver_2 = getserver_2.attributes.limits;


                                        let files;
                                        files = await client.pyteroAPI.listfiles(identifier)
                                        files = files.data;

                                        const npode = ['.npm', 'node_modules', 'package.json', 'package-lock.json']

                                        const object = Object?.values(files.filter(x => !npode.includes(x.attributes.name)))
                                        const objecta = Object?.values(object.filter(x => x.attributes.name))
                                        const arrar = objecta.map(x => x.attributes.name)

                                        await interaction.editReply({ content: `\`\`\`\n${arrar.join('\n')}\`\`\``, components: [], embeds: [], ephemeral: true })
                                    }

                                    if (button.startsWith('reiniciar_')) {
                                        const [, identifier] = button.split('_')

                                        let getserver_2 = await client.pyteroAPI.getserver(identifier);
                                        let getserver_3 = await client.pyteroAPI.getservera(identifier);

                                        getserver_3 = getserver_3.attributes.resources;
                                        getserver_2 = getserver_2.attributes.limits;


                                        await client.pyteroAPI.serverrestart(identifier)

                                        const Embed3 = new EmbedBuilder()
                                            .setTitle(`Info sobre o servidor - ${a.attributes.name?.replace("free", "")}`)
                                            .setDescription(`**Status**: ${getserver_3.uptime === 0 ? "Desligado" : "Ligado"}\n**UPtime**: ${moment.duration(getserver_3.uptime).format("y [anos] M [meses] d [dias] h [horas] m [minutos] e s [segundos]").replace("minsutos", "minutos")}\n\n**Uso de memoria ram**: ${formatBytes(getserver_3.memory_bytes)}/${getserver_2.memory} MB\n**Uso do Disco**: ${formatBytes(getserver_3.disk_bytes)}/${getserver_2.disk} MB\n**Uso do CPU**: ${getserver_3.cpu_absolute}%/${getserver_2.cpu}%\n\n**Recebimento de dados**: ${formatBytes(getserver_3.network_rx_bytes)} MB\n**Envio de dados**: ${formatBytes(getserver_3.network_tx_bytes)} MB`)
                                            .setColor(0x0099FF)

                                        reiniciar.setDisabled(true)

                                        await interaction.editReply({ embeds: [Embed3], components: botao })


                                        await interaction.followUp('Servidor reiniciado com sucesso')
                                    }

                                    if (button.startsWith('download_')) {
                                        const [, identifier] = button.split('_')

                                        let getserver_2 = await client.pyteroAPI.getserver(identifier);
                                        let getserver_3 = await client.pyteroAPI.getservera(identifier);

                                        getserver_3 = getserver_3.attributes.resources;
                                        getserver_2 = getserver_2.attributes.limits;


                                        let files;
                                        files = await client.pyteroAPI.listfiles(identifier)
                                        files = files.data;

                                        const npode = ['.npm', 'node_modules']

                                        const object = Object?.values(files.filter(x => !npode.includes(x.attributes.name)))
                                        const objecta = Object?.values(object.filter(x => x.attributes.name))
                                        const arrar = objecta.map(x => x.attributes.name)

                                        const compressfile = await client.pyteroAPI.compressfile(identifier, arrar);

                                        const downloadfile = await client.pyteroAPI.downloadfile(identifier, compressfile.attributes.name);

                                        setInterval(async () => {
                                            await client.pyteroAPI.deletefile(identifier, compressfile.attributes.name)
                                        }, 1800000);

                                        const Embed9 = new EmbedBuilder()
                                            .setDescription(`Download gerado com sucesso clique [aqui](${downloadfile.attributes.url}) para baixar`)
                                            .setColor(0x0099FF)

                                        interaction.user.send({ embeds: [Embed9] }).catch(err => { interaction.channel.send('Abra o seu privado para receber seu arquivo') })

                                        download.setDisabled(true)

                                        await interaction.editReply({ components: botao })

                                        await interaction.followUp('Download gerado com sucesso ')
                                    }

                                    if (button.startsWith('commit_')) {
                                        const [, identifier] = button.split('_')

                                        await interaction.guild.channels.create({
                                            name: `thread-${interaction.user.username}`,
                                            type: ChannelType.GuildText,
                                            parent: '1056090003043799040',
                                            permissionOverwrites: [
                                                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], },
                                                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory], deny: [PermissionsBitField.Flags.SendMessages] },
                                            ],
                                        }).then(c => {
                                            interaction.editReply({
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setDescription(`<:s_sim:1047273348364775536> | **Thread** aberta com sucesso!`)
                                                        .setColor('#1B1B1B')
                                                ],
                                                components: [
                                                    {
                                                        type: 1,
                                                        components: [
                                                            new ButtonBuilder()
                                                                .setStyle('Link')
                                                                .setLabel('Thread')
                                                                .setEmoji('<:s_arquivo2:1047276043339313182>')
                                                                .setURL(`https://discord.com/channels/${interaction.guild.id}/${c.id}`)
                                                        ]
                                                    }
                                                ], ephemeral: true
                                            });
                                            c.send({ content: `${interaction.user} Mande o seu arquivo` }).then(msg => {
                                                const filter = i => i.author.id === interaction.user.id;

                                                const collector = interaction.channel.createMessageCollector({ filter, max: 1 });

                                                collector.on('collect', async m => {

                                                    const attachments = m.attachments.first()

                                                    if (!attachments) return interaction.followUp('Digite o comando novamente e mande um arquivo').then(async () => {
                                                        setTimeout(async () => {
                                                            interaction.channel.delete();
                                                        }, 30000);
                                                    })
                                                    const file = attachments.url.split('/')[6];
                                                    if (attachments.contentType !== 'application/zip') return interaction.followUp('O arquivo tem que ser em .zip, Digite o comando novamente e mande um arquivo').then(async () => {
                                                        setTimeout(async () => {
                                                            interaction.channel.delete();
                                                        }, 30000);
                                                    })

                                                    await client.pyteroAPI.uploadfile(identifier, attachments.url).then(async () => {
                                                        await client.pyteroAPI.descompressfile(identifier, file).then(async () => {
                                                            await client.pyteroAPI.deletefile(identifier, file).then(async () => {
                                                                setTimeout(async () => {
                                                                    interaction.channel.delete();
                                                                }, 30000);
                                                            })
                                                        })
                                                    }).catch(e => console.log(e));

                                                });
                                            })

                                        })

                                        let getserver_2 = await client.pyteroAPI.getserver(identifier);
                                        let getserver_3 = await client.pyteroAPI.getservera(identifier);

                                        getserver_3 = getserver_3.attributes.resources;
                                        getserver_2 = getserver_2.attributes.limits;

                                        commit.setDisabled(true)
                                        interaction.editReply({ components: botao })


                                    }

                                });
                        })
                    })
            })

    }
}