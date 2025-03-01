const { Interaction, BaseCommandInteraction, EmbedBuilder, Constants, ApplicationCommandOptionType } = require("discord.js");

module.exports = class {
   name = 'limpar';
   description = 'Deleta mensagens no canal.';
   category = 'moderation';
   options = [
      {
         name: 'quantidade',
         description: 'Quantas mensagens para apagar.',
         type: ApplicationCommandOptionType.Number,
         required: true,
      }
   ]

   constructor() {
   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   async run(interaction, client) {
      // if (interaction.member.roles.has(''))
      await interaction.channel.bulkDelete(interaction.options.getNumber('quantidade'))
      interaction.reply({ content: `${interaction.options.getNumber('quantidade')} mensagens foram apagadas!`, ephemeral: true });
   }
}