const { Interaction, BaseCommandInteraction, MessageEmbed, Constants } = require("discord.js");
const { Bot } = require("../../structures/Client");

module.exports = class {
   /**
    * 
    * @param {Bot} client 
    */
   constructor(client) {
      this.client = client;
      this.name = 'limpar';
      this.description = 'Deleta mensagens no canal.';
      this.category = 'moderation';
      this.options = [
         {
            name: 'quantidade',
            description: 'Quantas mensagens para apagar.',
            type: Constants.ApplicationCommandOptionTypes.NUMBER,
            required: true,
         }
      ]
   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   async run(interaction) {
      // if (interaction.member.roles.has(''))
     await interaction.channel.bulkDelete(interaction.options.getNumber('quantidade'))
      interaction.reply({ content: `${interaction.options.getNumber('quantidade')} mensagens foram apagadas!`, ephemeral: true });
   }
}