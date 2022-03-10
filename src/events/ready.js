const { Client } = require("discord.js");
const { Bot } = require("../structures/Client");

module.exports = class {
   /**
   * 
   * @param {Bot} client 
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
      this.client.vulkava.start(this.client.user.id);
      console.log('O bot está on! Com o nome ' + this.client.user.username + ' e com ' + this.client.guilds.cache.size + ' guildas');
   }
}