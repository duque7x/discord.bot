const { Interaction, BaseCommandInteraction, MessageEmbed } = require("discord.js");

module.exports = class {
   constructor(client) {
      this.client = client;
      this.name = 'help';
      this.description = 'Embed de ajuda.';
      this.options = [
         {
            name: "file",
            type: 11,
            description: 'A file'
         }
      ]
   }
   /**
    * 
    * @param {BaseCommandInteraction} interaction 
    */
   run(interaction) {
      const embed = new MessageEmbed()
         .setColor('DARK_GREEN')
         .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
         .setTitle("Embed de ajuda")
         .setDescription("Embed de ajuda")
         .addField("This is a single field title, it can hold 256 characters", "This is a field value, it can hold 1024 characters.")
         .addFields(
            { name: "Inline fields", value: "They can have different fields with small headlines, and you can inline them.", inline: true },
            { name: "Masked links", value: "You can put [masked links](https://discord.js.org/#/docs/main/master/class/MessageEmbed) inside of rich embeds.", inline: true },
            { name: "Markdown", value: "You can put all the *usual* **__Markdown__** inside of them.", inline: true }
         )
         .addField("\u200b", "\u200b")
         .setTimestamp()
         .setFooter({text: "This is the footer text, it can hold 2048 characters", iconURL: "http://i.imgur.com/w1vhFSR.png"});

      interaction.reply({ embeds: [embed], ephemeral: true });
      console.log(interaction.options.data[0].type);
   }
}