const { Client } = require("discord.js");
const { Bot } = require("../structures/Client");
const chalk = new (require('chalk').Chalk);

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
      console.log(chalk.red(`O bot está on! Com o nome ${this.client.user.username} e com ${this.client.guilds.cache.size} guildas`));

      this.client.guilds.cache.forEach(guild => {
         console.log(`gUILD: ${guild.id} nome: ${guild.name}, membros: ${guild.memberCount}`);
      });
   }
}