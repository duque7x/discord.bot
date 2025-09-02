import { Guild, VipMember } from "@duque.edits/sdk";
import { StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../../../structures/Client";
import vipInfoEmbed from "../../../Embeds/vipInfoEmbed";
import Embeds from "../../../../structures/Embeds";

export default async function (
  client: Bot,
  guildApi: Guild,
  interaction: StringSelectMenuInteraction,
  vipMember: VipMember
) {
  try {
    await interaction.deferReply({ flags: 64 });
    const embed = vipInfoEmbed(vipMember, interaction);
    return interaction.editReply({ embeds: [embed] });
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
