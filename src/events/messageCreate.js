const { Message, Collection } = require("discord.js");
const { Bot } = require("../structures/Client");
const map = new Collection()
module.exports = class {
   /**
   * 
   * @param {Bot} client 
   */
   constructor(client) {
      this.client = client;
      this.name = 'messageCreate'
   }
   /**
    * 
    * @param {Message} message 
    */
   async run(message) {
      try {
         if (message.content.startsWith('http://') || message.content.startsWith('https://') && !message.member.roles.cache.has(('949792354259337266'))) {
            return message.delete();
         }
      } catch (o) {
         message.channel.send({
            content: `Este comando não foi encontrado!`,
         });
         console.log(o);
      }
   }
}