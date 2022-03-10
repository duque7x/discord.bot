const { Bot } = require("./src/structures/Client");
const { token } = require('./config.json')
const client = new Bot({
   intents: [
      'GUILDS',
      "GUILD_VOICE_STATES",
      "GUILD_MESSAGES"
   ]
});

client.vulkava.on('trackStart', (player, track) => {
   const channel = client.channels.cache.get(player.textChannelId);

   channel.send(`Tocando \`${track.title}\``);
});

client.vulkava.on('queueEnd', (player) => {
   const channel = client.channels.cache.get(player.textChannelId);

   channel.send(`Acabou!`);

   player.destroy();
});

client.vulkava.on('error', (node, err) => {
   console.error(`[Vulkava] Error on node ${node.identifier}`, err.message);
});
client.loadCommands();
client.loadEvents();
client.registryCommands()
client.host()
process.on('unhandledRejection', (err) => { });
process.on('uncaughtException', (err) => { });