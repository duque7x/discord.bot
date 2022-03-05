const { BaseCommandInteraction, MessageEmbed } = require("discord.js");
const { Bot } = require("../../structures/Client");

module.exports = class {
   /**
    * 
    * @param {Bot} client 
    */
   constructor(client) {
      this.client = client;
      this.name = 'ajuda';
      this.description = 'Embed de ajuda.';
      this.options = [
         {
            name: 'comando',
            description: 'Nome do commando',
            type: 3
         }
      ];
      this.category = 'info';
   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   run(interaction) {
      const embed = new MessageEmbed()
         .setColor('AQUA')
         .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
         .setTitle("Embed de ajuda")
         .setDescription("Se tiveres com dificuldade em usar os meus comandos digite /help e clique na opção comando e escreva o nome do comando.")
         .addFields(
            {
               name: '> Informação 📚',
               value: `\`\`\`${this.client.commands.filter(i => i.category === 'info').map(o => o.name).join(', ')}\`\`\``
            },

         )
         .setThumbnail(interaction.user.defaultAvatarURL)
         .setTimestamp();

      if (interaction.options.getString('comando')) {
         const embed = new MessageEmbed()
            .setColor('DARK_GOLD')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTitle("Comando " + interaction.options.getString('comando'))
            .addFields([
               {
                  name: 'Descrição',
                  value: this.client.commands.find((c) => c.name === interaction.options.getString('comando')).description
               },
               {
                  name: 'Categoria',
                  value: this.client.commands.find((c) => c.name === interaction.options.getString('comando')).category
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