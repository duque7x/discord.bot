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
         const command = this.client.commands.find(i => i.name == interaction.commandName);

         if (command.category === "moderation" && !interaction.member.roles.cache.has('949792354259337266')) return interaction.reply({ content: 'Sem permissão para executar o comando.', ephemeral: true});
         command.run(interaction);
      } catch(o) {
         interaction.channel.send({
            content:  `O commando ${interaction.commandName} não foi encontrado!`,
            ephemeral: true,
         });
         console.log(o);
         process.exit(1);
      }
   }
}