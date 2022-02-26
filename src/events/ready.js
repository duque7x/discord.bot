const { Client } = require("discord.js");

module.exports = class {
   /**
    * 
    * @param {Client} client 
    */
   constructor(client) {
      this.client = client;
      this.name = 'ready'
   }
   run() {
      this.client.user.setActivity({
         name: 'Ajudando digite /help',
         type: 'LISTENING',
      });
      console.log('O bot está on! Com o nome ' + this.client.user.username + ' e com ' + this.client.guilds.cache.size + ' guildas');
   }
}