import rest, { VipMember } from "@duque.edits/sdk";
import { PermissionFlagsBits, StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../../structures/Client";
import Embeds from "../../../structures/Embeds";
import Messages from "../../../structures/Messages";
import role from "./role/role";
import channel from "./channel/channel";

export default async function (guildApi: rest.Guild, interaction: StringSelectMenuInteraction, client: Bot) {
  try {
    const isAdmin = interaction.memberPermissions.has(PermissionFlagsBits.Administrator);
    const [_, option, vipMemberId] = interaction.customId.split("-");
    if (interaction.user.id !== vipMemberId && !isAdmin)
      return interaction.reply({ content: Messages.no_permissions, flags: 64 });

    const vipmember = guildApi.vipMembers.cache.get(vipMemberId);
    if (!vipmember) return interaction.reply({ embeds: [Embeds.no_vip], flags: 64 });
    const hasVipExpired = vipmember.duration.getTime() < Date.now();
    if (hasVipExpired) return interaction.reply({ embeds: [Embeds.expired_vip], flags: 64 });

    const handlers: Record<
      string,
      (guildApi: rest.Guild, interaction: StringSelectMenuInteraction, client: Bot, vipMember: VipMember) => any
    > = { role, channel };
    if (option.startsWith("separator")) return interaction.deferUpdate();

    const value = interaction.values[0];
    if (value === "close") {
      await interaction.reply({
        content: [
          "-# ↪ Canal sendo excluido em alguns segundos...",
          "-# ↪ This channel will be deleted in a few seconds...",
        ].join("\n"),
        flags: 64,
      });

      setTimeout(() => interaction.channel.delete(), 10 * 1000);
      return;
    }
    const handler = handlers[option];
    if (handler) return handler(guildApi, interaction, client, vipmember);
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
