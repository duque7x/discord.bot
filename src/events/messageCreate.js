const { Message, Collection } = require("discord.js");
const { Bot } = require("../structures/Client");


module.exports = class {
   name = 'messageCreate';
   /**
   * 
   * @param {Bot} client 
   */
   constructor(client) {
      this.client = client;
   }
   /**
    * 
    * @param {Message} message 
    */
   async run(message) {
      try {
         if (message.content.startsWith('http://') || message.content.startsWith('https://')) {
            return message.delete();
         }
         if (message.content == "<@1056957302462238820>") message.reply("Qual foi?")
      } catch (o) {
         message.channel.send({
            content: `Este comando não foi encontrado!`,
         });
         console.log(o);
      }
   }
}