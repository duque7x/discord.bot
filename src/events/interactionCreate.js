const { Interaction , BaseCommandInteraction} = require("discord.js");
const { Bot } = require("../structures/Client");
module.exports = class {
   /**
   * 
   * @param {Bot} client 
   */
   constructor(client) {
      this.client = client;
      this.name = 'interactionCreate'
   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   run(interaction) {
      try {
         this.client.commands.find(i => i.name == interaction.commandName).run(interaction);
      } catch(o) {
         interaction.reply({
            content:  `O commando ${interaction.commandName} não foi encontrado!`,
            ephemeral: true,
         });
         console.log(o);
      }
   }
}