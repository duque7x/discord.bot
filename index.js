const Bot = require("./src/structures/Client");
const {token}= require('./config.json')
const client = new Bot({
   intents: [
      'GUILDS'
   ]
});

client.loadCommands();
client.loadEvents();
client.registryCommands()