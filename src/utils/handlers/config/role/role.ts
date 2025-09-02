import { GuildMember, StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../../../structures/Client";
import { Guild, VipMember } from "@duque.edits/sdk";
import name from "./additionals/name";
import color from "./additionals/color";
import icon from "./additionals/icon";
import Embeds from "../../../../structures/Embeds";

export default async function (
  guildApi: Guild,
  interaction: StringSelectMenuInteraction,
  client: Bot,
  vipMember: VipMember
) {
  try {
    const value = interaction.values[0];

    let vipmemberRole = interaction.guild.roles.cache.get(vipMember.roleId);
    if (!vipmemberRole) {
      vipmemberRole = await interaction.guild.roles.create({
        name: `waiting-${interaction.user.username}`,
        mentionable: false,
      });
      await vipMember.update({ roleId: vipmemberRole.id });
    }

    if (value === "name") return name(interaction, vipmemberRole);
    if (value === "color") return color(interaction, vipmemberRole);
    if (value === "icon") return icon(interaction, vipmemberRole);
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
