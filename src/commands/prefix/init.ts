import { GuildMemberRoleManager, Message, PermissionFlagsBits } from "discord.js";
import { Bot } from "../../structures/Client";
import generateDashboard from "../../utils/panels/generateDashboard";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";

export default {
  name: "init",
  alias: ["init"],
  description: "init.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const isAdmin = message.member.permissions?.has(PermissionFlagsBits.Administrator);
      const allowedRoles = guild.roles.find((r) => r.type == "team")?.ids;
      const hasRole = allowedRoles?.some((r) =>
        (message?.member?.roles as GuildMemberRoleManager).cache.some((r2) => r == r2.id)
      );

      if (!isAdmin && !hasRole) return message.delete();

      const channels = message.guild.channels.cache.filter((c) => c.name.startsWith("fila・"));
      const voiceChannels = message.guild.channels.cache.filter((c) => c.name.startsWith("🚩 Equipa"));
      const voiceGlobalChannels = message.guild.channels.cache.filter((c) => c.name.startsWith("🚩 Global"));
      channels.forEach(c => c.delete());
      voiceChannels.forEach(c => c.delete());
      voiceGlobalChannels.forEach(c => c.delete());
      
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};
