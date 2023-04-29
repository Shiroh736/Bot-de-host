const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./src/config/config.json');
const pyteroAPI = require("./src/modules/api/index");
console.log("Starting System and Database...")

var client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

process.on("unhandledRejection", async (err) => {
    console.error("AEE FILHO DA PUTA, DEU ERRO AQUI MANO:\n", err);
  });
  process.on("uncaughtException", async (err) => {
    console.error("AEE FILHO DA PUTA, DEU ERRO AQUI MANO:\n", err);
  });
  process.on("uncaughtExceptionMonitor", async (err) => {
    console.error("AEE FILHO DA PUTA, DEU ERRO AQUI MANO: (Monitor):\n", err);
  });

module.exports = client;
client.slash = new Collection();
client.pyteroAPI = new pyteroAPI();
client.tickets = new Collection();

require('./src/handler')(client);
client.login(token);