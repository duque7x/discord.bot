const { Bot } = require("./src/structures/Client");

const client = new Bot({
   intents: [
      'GUILDS',
      "GUILD_MESSAGES"
   ]
});


client.loadCommands();
client.loadEvents();
client.registryCommands()

process.on('unhandledRejection', console.log);
process.on('uncaughtException', console.log);