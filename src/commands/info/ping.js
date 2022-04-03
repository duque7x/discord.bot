const { Interaction, BaseCommandInteraction, MessageEmbed } = require("discord.js");

module.exports = class {
   constructor(client) {
      this.client = client;
      this.name = 'ping';
      this.description = 'Ping do bot';
      this.category = 'info'
   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   run(interaction) {
      const embed = new MessageEmbed()
         .setColor(0x3498DB)
         .setAuthor({ name: "Author Name, it can hold 256 characters", iconURL: "https://i.imgur.com/lm8s41J.png" })
         .setTitle("This is your title, it can hold 256 characters")

      interaction.reply({ embeds: [embed], ephemeral: true });
   }
}