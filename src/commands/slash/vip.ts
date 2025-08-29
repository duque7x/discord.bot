import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Bot } from "../../structures/Client";
import Embeds from "../../structures/Embeds";
import { vipPanel } from "../../utils/panels/vipPanel";

export default {
  adminOnly: true,
  data: new SlashCommandBuilder().setName("vip").setDescription("Painel de vip"),
  async execute(client: Bot, interaction: CommandInteraction) {
    try {
      const { embed, row } = vipPanel(interaction.guild);
      if (interaction.channel.isSendable()) {
        await interaction.channel.send({ embeds: [embed], components: [row] });
        return interaction.reply({
          content: `<:yes_green:1410952174544093204> \`|\` **Painel enviado** com sucesso.`,
          flags: 64,
        });
      } else {
        return interaction.reply({
          content: `<:no_red:1407331795208372388> \`|\` **Canal invalido.**`,
          flags: 64,
        });
      }
    } catch (error) {
      console.error(error);
      if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
      else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });

      return;
    }
  },
};
