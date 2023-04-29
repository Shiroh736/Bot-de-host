const { EmbedBuilder, ButtonBuilder, ChannelType, ApplicationCommandType, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { accessToken, role } = require('../../config/config.json');
const mercadopago = require('mercadopago');
mercadopago.configure({ access_token: accessToken });
const n_sei = require('../../db/planos.json')
const { JsonDatabase } = require("wio.db");
const {basico , medio , avancado , final} = require('../../db/planos.json')
const pagamentos = new JsonDatabase({ databasePath: `${__dirname}/../../db/pagamentos.json` });
const planoss = new JsonDatabase({ databasePath: `${__dirname}/../../db/planos.json` });

const users = new JsonDatabase({ databasePath: `${__dirname}/../../db/users.json` });
const ms = require('ms');
module.exports = {
    name: 'comprar',
    description: 'Upar seu bot para hospedagem',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'planos',
            description: 'Escolha um plano para comprar',
            type: 3,
            choices: [
                {
                    name: 'Basic',
                    value: 'basico',
                },
                {
                    name: 'Medium',
                    value: 'medio',
                },
                {
                    name: 'Advanced',
                    value: 'avancado',
                },
                {
                    name: 'Deluxe',
                    value: 'final',
                }
            ],
            required: true
        },
    ],

    run: async ({ client, interaction }) => {
        const planos = await interaction.options.getString('planos');
        const user = users.get(interaction.user.id)
    if (!user) return interaction.reply('voce nao esta registado na nossa data base utilize /registrar para se registrar')

        let valor;

        if (planos === 'basico') {
            valor = Number(n_sei.basico.price)
        }
        if (planos === 'medio') {
            valor = Number(n_sei.medio.price)
        }
        if (planos === 'avancado') {
            valor = Number(n_sei.avancado.price)
        }
        if (planos === 'final') {
            valor = Number(n_sei.final.price)
        }
        console.log('[Doação] ' + interaction.user.tag + ' | ' + interaction.user.id + ' | ' + planos + ' | ' + valor + ' | ' + 'MercadoPago' + ' | ' + 'Aguardando Pagamento...')
        const email = 'emailquaquer@sla.com'; // Email qualquer aqui

        const payment_data = {
            transaction_amount: valor,
            description: 'vip',
            payment_method_id: 'pix',
            payer: {
                email,
                first_name: `${interaction.user.tag} (${interaction.user.id})`,
            }
        };

        const data = await mercadopago.payment.create(payment_data);
        const base64_img = data.body.point_of_interaction.transaction_data.qr_code_base64;
        const copia_e_cola = data.body.point_of_interaction.transaction_data.qr_code;

        const buf = Buffer.from(base64_img, 'base64');
        interaction.reply({ files: [new AttachmentBuilder(buf, 'pagamento.png')], content: `${copia_e_cola}`, ephemeral: true })

        pagamentos.set(interaction.user.id, {
            plano: planos,
            _id: parseInt(data.body.id),
            server_id: interaction.guildId,
            user_id: interaction.user.id,
            pagamento_confirmado: false,
        });

        let tentativas = 0;
        const interval = setInterval(async () => {
            tentativas++;

            const res = await mercadopago.payment.get(data.body.id);
            const pagamentoStatus = res.body.status;

            if (tentativas >= 8 || pagamentoStatus === 'approved') {

                clearInterval(interval);

                if (pagamentoStatus === 'approved') {
                    const cu = await pagamentos.get(interaction.user.id)
                    const time = ms('30d')

                    pagamentos.set(interaction.user.id, {
                        plano: cu.plano,
                        _id: cu._id,
                        server_id: cu.server_id,
                        user_id: cu.user_id,
                        pagamento_confirmado: true,
                        data: res.body.date_approved,
                        valor,
                    });

                    console.log('[Doação] ' + interaction.user.tag + ' | ' + interaction.user.id + ' | ' + planos + ' | ' + valor + ' | ' + 'MercadoPago' + ' | ' + 'Pagamento Confirmado')
                    
                    users.set(`${interaction.user.id}.hasVip`, true)
                    users.set(`${interaction.user.id}.date`, cu.time > 0 ? cu.time + time : Date.now() + time)
                    users.set(`${interaction.user.id}.plano`, cu.plano)


                    let guild = client.guilds.cache.get(cu.server_id);
                    let member = guild.members.cache.get(cu.user_id);

                    const role = (`${(cu.plano).role}`)
                    member.roles.add(role);

                    const aprovou = new EmbedBuilder()
                        .setAuthor ({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setColor('#00ff00')
                        .setThumbnail('https://t3.ftcdn.net/jpg/03/08/80/02/240_F_308800209_gXfQUJxPuRNwFWqNw9MkPwtJcfNMUQl0.jpg')
                        .setTitle('Donation  Approved!')
                        .setDescription(`Sua doação foi confirmada. Obrigado por confiar na Automation Cloud, fazemos nosso trabalho com foco na experiência que você merece!`)

                    interaction.dmchannel.send(aprovou)

                }
            }
        }, 30_000);
    }
}