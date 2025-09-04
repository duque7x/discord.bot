import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMemberRoleManager,
  Message,
  PermissionFlagsBits,
} from "discord.js";
import { Bot } from "../../structures/Client";
import generateDashboard from "../../utils/panels/generateDashboard";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import vipInfoEmbed from "../../utils/Embeds/vipInfoEmbed";
import generateVipMemberConfig from "../../utils/panels/generateVipMemberConfig";

export default {
  name: "vipmembers",
  alias: ["painelmemebrs"],
  description: "Manusie os membros aqui mesmo.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const isAdmin = message.member.permissions?.has(PermissionFlagsBits.Administrator);
      const allowedRoles = guild.permissions.manage_bot;
      const hasRole = allowedRoles?.some((r) =>
        (message?.member?.roles as GuildMemberRoleManager).cache.some((r2) => r == r2.id)
      );

      if (!isAdmin && !hasRole) return message.delete();

      const embeds = guild.vipMembers.cache.map((m) => vipInfoEmbed(m, message));

      const first = generateVipMemberConfig(0, embeds);
      return message.reply({ embeds: [first.embed], components: [first.row, first.row2] });
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};
