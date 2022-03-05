const {Bot} = require("./src/structures/Client");
const {token}= require('./config.json')
const client = new Bot({
   intents: [
      'GUILDS',
      "GUILD_VOICE_STATES"
   ]
});

client.loadCommands();
client.loadEvents();
client.registryCommands()

process.on('unhandledRejection', (err) => {});
process.on('uncaughtException', (err) => {});