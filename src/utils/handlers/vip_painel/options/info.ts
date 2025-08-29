import { Guild, VipMember } from "@duque.edits/sdk";
import { StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../../../structures/Client";
import vipInfoEmbed from "../../../Embeds/vipInfoEmbed";

export async function info(
  client: Bot,
  guildApi: Guild,
  interaction: StringSelectMenuInteraction,
  vipMember: VipMember
) {
  await interaction.deferReply({ flags: 64 });
  const embed = vipInfoEmbed(vipMember, interaction);
  return interaction.editReply({ embeds: [embed] });
}
