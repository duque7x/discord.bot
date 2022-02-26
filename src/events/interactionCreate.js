const { Interaction , BaseCommandInteraction} = require("discord.js");

module.exports = class {
   constructor(client) {
      this.client = client;
      this.name = 'interactionCreate'
   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   run(interaction) {
      try  {
         this.client.commands.find(i => i.name == interaction.commandName).run(interaction);
      } catch {
         interaction.reply({
            content:  `O commando ${interaction.commandName} não foi encontrado!`,
            ephemeral: true,
         });
      }
   }
}