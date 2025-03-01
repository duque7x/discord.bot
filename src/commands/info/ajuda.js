const { BaseCommandInteraction, EmbedBuilder, ApplicationCommandOptionType, Colors } = require("discord.js");
module.exports = class {
   name = 'ajuda';
   description = 'Embed de ajuda.';
   options = [
      {
         name: 'comando',
         description: 'Nome do commando',
         type: ApplicationCommandOptionType.String
      }
   ];
   category = 'info';
   constructor() {

   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   run(interaction, client) {
      const embed = new EmbedBuilder()
         .setColor(Colors.Aqua)
         .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
         .setTitle("Embed de ajuda")
         .setDescription("Se tiveres com dificuldade em usar os meus comandos digite /help e clique na opção comando e escreva o nome do comando.")
         .addFields(
            {
               name: '> Informação 📚',
               value: `${client.commands.filter(i => i.category === 'info').map(o => o.name).join(', ')}`
            },

         )
         .setThumbnail(interaction.user.defaultAvatarURL)
         .setTimestamp();
      if (interaction.options.getString('comando')) {
         const command = client.commands.find((c) => c.name === interaction.options.getString('comando'));

         const embed = new EmbedBuilder()
            .setColor('DARK_GOLD')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTitle("Comando " + interaction.options.getString('comando'))
            .addFields([
               {
                  name: 'Descrição',
                  value: command.description
               },
               {
                  name: 'Categoria',
                  value: command.category
               },
            ])
            .setThumbnail(interaction.user.defaultAvatarURL)
            .setTimestamp();
         interaction.reply({ embeds: [embed], ephemeral: true });
         return
      }

      interaction.reply({ embeds: [embed] });
   }
}