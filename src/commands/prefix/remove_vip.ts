import { GuildMemberRoleManager, Message, PermissionFlagsBits } from "discord.js";
import { Bot } from "../../structures/Client";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import Messages from "../../structures/Messages";
import addedVipEmbed from "../../utils/Embeds/addedVipEmbed";
import removedVipEmbed from "../../utils/Embeds/removedVipEmbed";

export default {
  name: "remove_vip",
  alias: ["removervip", "remvip"],
  description: "init.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const isAdmin = message.member.permissions?.has(PermissionFlagsBits.Administrator);
      const allowedRoles = guild.permissions.manage_bot;
      const hasRole = allowedRoles?.some((r) =>
        (message?.member?.roles as GuildMemberRoleManager).cache.some((r2) => r == r2.id)
      );
      if (!isAdmin && !hasRole) return message.delete();

      // clean args from mentions
      args = args.filter((p) => !p.startsWith("<@"));
      const mention = message.mentions.members.at(0) ?? (args[0] ? message.guild.members.cache.get(args[0]) : null);

      const targetMember = mention ?? message.member;
      if (!targetMember) return message.reply({ content: Messages.no_member_mention });

      let vipmember = guild.vipMembers.cache.get(targetMember.id);
      const hadVip = guild.vipMembers.cache.has(targetMember.id);

      if (!hadVip) return message.reply({ embeds: [Embeds.no_vip] });

      const vipDuration = vipmember.duration ? new Date(vipmember.duration) : null;
      const hasExpired = vipDuration ? vipDuration.getTime() < Date.now() : true;

      if (hasExpired) {
        await message.reply({ embeds: [Embeds.expired_vip] });
        if (vipmember.status !== "off") {
          await vipmember.update({ status: "off" });
        }

        const { roleId, voiceChannelId } = vipmember;
        const role = message.guild.roles.cache.get(roleId);
        const channel = message.guild.channels.cache.get(voiceChannelId);

        if (role) role.delete();
        if (channel) channel.delete();
        return;
      }

      // args[1] is duration (default 1d if not provided)
      const durationString = args[1] ?? "1d";
      const durationSec = client.resolveDuration(durationString);

      const current = vipDuration ?? new Date();
      const newDurationMs = current.getTime() - durationSec * 1000;
      const newDate = new Date(newDurationMs);

      await vipmember.update({
        duration: newDate,
        status: "on",
        name: targetMember.user.username,
        guild_id: targetMember.guild.id,
      });

      return message.reply({
        embeds: [
          removedVipEmbed(
            client.secondsToDays(durationSec),
            targetMember,
            client.secondsToDays(Math.floor((newDate.getTime() - Date.now()) / 1000))
          ),
        ],
      });
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};

/* export function resolveDuration(dur: string) {
  if (!dur) return;

  const reg = /^(\d+)(\D.*)?$/;
  const matches = dur.match(reg);
  const value = matches ? Number(matches[1]) : 1;
  const unit = matches?.[2]?.toLowerCase() ?? "d";

  const durMap = [
    { alias: ["d", "days", "dias"], multiplier: 24 * 60 * 60 },
    { alias: ["h", "horas"], multiplier: 60 * 60 },
    { alias: ["min", "m", "minutos"], multiplier: 60 },
    { alias: ["s", "sec", "segundos"], multiplier: 1 },
  ];

  const duration = durMap.find((d) => d.alias.includes(unit))?.multiplier ?? 24 * 60 * 60;
  return value * duration;
}

export function secondsToDays(sec: number) {
  return sec / 60 / 60 / 24;
}
 */
