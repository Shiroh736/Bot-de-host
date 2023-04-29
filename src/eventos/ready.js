const client = require('../../index');
const { JsonDatabase } = require("wio.db");
const user = new JsonDatabase({ databasePath: `${__dirname}/../db/users.json` });
const config = require('../config/config.json')

client.on('ready', () => {
    console.log(`🦈  Three Cloud System is Online!`);

    let avisados = [];
    const verifydate = async () => {
        const lista = user.all();
        const users = Object?.values(lista[0])?.filter(x => 3 >= Math.floor((x?.date - Date.now()) / 1000 / 60 / 60 / 24) && !avisados.includes(x.id) && x?.hasVip);

        if (!users.length) return;

        for (let { id } of users) {
            avisados.push(id)
            const user = await client.users.fetch(id)
            user?.send(`Olá, seu plano está prestes a expirar, caso queira renovar, utilize o comando /comprar`)
        }
    }

    const removerVips = async () => {
        const lista = user.all();
        const users = Object?.values(lista[0])?.filter(x => x?.date <= Date.now() && x?.hasVip);

        if (!users.length) return;

        for (let { id } of users) {
            const servers = await client.pyteroAPI.getservers();
            const a = servers.data.filter(e => e.attributes.description.includes(id));
            a.map(async server => {
                await client.pyteroAPI.serverdel(server.attributes.internal_id).catch(e => console.log(e))
            })
        }
    }

    const status = async () => {
        const servers = await client.pyteroAPI.getservers();
        const free = servers.data.filter(e => e.attributes.name.includes('free'));
        const pago = servers.data.filter(e => !e.attributes.name.includes('free'));

        let guild = client.guilds.cache?.get(config.server);
        let members = client.channels.cache?.get(config.members)
        let ping = client.channels.cache?.get(config.ping)
        let apps_free = client.channels.cache?.get(config.apps_free)
        let apps_pago = client.channels.cache?.get(config.apps_pago)

        members?.setName(`🚀┃Members: ${guild?.memberCount}`)
        ping?.setName(`📶┃Ping: ${client.ws.ping}ms`)
        apps_free?.setName(`🤖┃Apps Free: ${free?.length}`)
        apps_pago?.setName(`🤖┃Apps Paid: ${pago?.length}`)
    }

    setInterval(async () => verifydate(), 5000);
    setInterval(async () => removerVips(), 5000);
    setInterval(async () => status(), 5000);

    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: "Three Cloud |",
            type: 'STREAMING',
            url: 'https://twitch.tv/discord'
        }
    })
})

