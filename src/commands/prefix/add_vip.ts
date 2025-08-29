import { GuildMemberRoleManager, Message, PermissionFlagsBits } from "discord.js";
import { Bot } from "../../structures/Client";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import Messages from "../../structures/Messages";
import addedVipEmbed from "../../utils/Embeds/addedVipEmbed";

export default {
  name: "add_vip",
  alias: ["adicionarvip", "addvip"],
  description: "init.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const isAdmin = message.member.permissions?.has(PermissionFlagsBits.Administrator);
      const allowedRoles = guild.roles.find((r) => r.type == "team")?.ids;
      const hasRole = allowedRoles?.some((r) =>
        (message?.member?.roles as GuildMemberRoleManager).cache.some((r2) => r == r2.id)
      );
      if (!isAdmin && !hasRole) return message.delete();
      console.log({ args });
      args = args.filter((p) => !p.startsWith("<@"));
      console.log({ args });
      const mention = args[0] ? message.guild.members.cache.get(args[0]) : message.mentions.members.at(0);

      const targetMember = mention ?? message.member;
      // console.log({ targetMember, m: message.mentions.members.at(0) });
      if (!targetMember) return message.reply({ content: Messages.no_member_mention });

      const type = args[1];
      const allowedTypes = ["both", "role", "channel", "ambos", "cargo", "canal"];
      if (!type || !allowedTypes.includes(type)) return message.reply({ content: Messages.type_not_allowed_vip });

      const translations: { default: "both" | "role" | "channel"; aliases: string[] }[] = [
        {
          default: "both",
          aliases: ["ambos", "todos", "dois"],
        },
        {
          default: "role",
          aliases: ["cargo"],
        },
        {
          default: "channel",
          aliases: ["canal"],
        },
      ];

      const translated = translations.find((t) => t.default === type || t.aliases.includes(type));
      console.log({ translated, type });
      let vipmember = guild.vipMembers.cache.get(targetMember.id);
      const hadVip = guild.vipMembers.cache.has(targetMember.id);

      if (!hadVip) {
        vipmember = await guild.vipMembers.create({
          type: translated.default ?? "channel",
          status: "on",
          name: targetMember.user.username,
          id: targetMember.id,
          guild_id: targetMember.guild.id,
        });
      }

      const durationString = args[2];
      const durationSec = resolveDuration(durationString);
      const durationHad = vipmember.duration;
      const newDurationMs = durationHad.getTime() + durationSec * 1000;
      const newDate = new Date(newDurationMs);
      console.log({ durationSec, durationHad, newDate, durationString, hadVip });

      await vipmember.update({
        duration: newDate,
        type: translated.default ?? "channel",
        status: "on",
        name: targetMember.user.username,
        guild_id: targetMember.guild.id,
      });
      return message.reply({
        embeds: [addedVipEmbed(secondsToDays(durationSec), targetMember, translated.aliases[0])],
      });
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};
export function resolveDuration(dur: string) {
  if (!dur) return;

  const reg = /^(\d+)(\D.*)?$/;
  const matches = dur.match(reg);
  const value = matches ? Number(matches[1]) : 7;
  const unit = matches?.[2]?.toLowerCase() ?? "d";

  const durMap = [
    { alias: ["d", "days", "dias"], multiplier: 24 * 60 * 60 },
    { alias: ["h", "horas"], multiplier: 60 * 60 },
    { alias: ["min", "m", "minutos"], multiplier: 60 },
    { alias: ["s", "sec", "segundos"], multiplier: 1000 },
  ];

  const duration = durMap.find((d) => d.alias.includes(unit))?.multiplier ?? 24 * 60 * 60;
  return value * duration;
}

export function secondsToDays(sec: number) {
  return sec / 60 / 60 / 24;
}
