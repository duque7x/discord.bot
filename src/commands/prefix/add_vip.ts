import { GuildMemberRoleManager, Message, PermissionFlagsBits } from "discord.js";
import { Bot } from "../../structures/Client";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import Messages from "../../structures/Messages";
import addedVipEmbed from "../../utils/Embeds/addedVipEmbed";
import { Duration } from "../../types/Duration";

export default {
  name: "add_vip",
  alias: ["adicionarvip", "addvip"],
  description: "init.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const isAdmin = message.member.permissions?.has(PermissionFlagsBits.Administrator);
      //const allowedRoles = guild.permissions.manage_bot;
      const allowedRoles = guild.permissions.manage_bot;
      const hasRole = allowedRoles?.some((r) =>
        (message?.member?.roles as GuildMemberRoleManager).cache.some((r2) => r == r2.id)
      );
      console.log({ isAdmin, hasRole, allowedRoles });
      if (!isAdmin && !hasRole) return message.delete();

      // remove mentions from args
      args = args.filter((p) => !p.startsWith("<@"));

      const mention = message.mentions.members.at(0) ?? (args[0] ? message.guild.members.cache.get(args[0]) : null);
      const targetMember = mention ?? message.member;
      if (!targetMember) return message.reply({ content: Messages.no_member_mention });

      // find type
      let type = args.find((a) => arrayToRegex(["both", "role", "channel", "ambos", "cargo", "canal"]).test(a));
      if (!type) type = "channel";

      const translations: { default: "both" | "role" | "channel"; aliases: string[] }[] = [
        { default: "both", aliases: ["ambos", "todos", "dois"] },
        { default: "role", aliases: ["cargo"] },
        { default: "channel", aliases: ["canal"] },
      ];
      const translated = translations.find((t) => t.default === type || t.aliases.includes(type)) ?? translations[2];

      let vipmember = guild.vipMembers.cache.get(targetMember.id);
      const hadVip = guild.vipMembers.cache.has(targetMember.id);

      if (!hadVip) {
        vipmember = await guild.vipMembers.create({
          type: translated.default,
          status: "on",
          name: targetMember.user.username,
          id: targetMember.id,
          guild_id: targetMember.guild.id,
        });
      }

      const durationArg = args.find((a) => buildDurationRegex(client.durationMap).test(a));
      const durationSec = client.resolveDuration(durationArg) ?? 7 * 24 * 60 * 60; // default 7 days

      const durationHad = vipmember.duration ? new Date(vipmember.duration) : new Date();
      const newDurationMs = durationHad.getTime() + durationSec * 1000;
      const newDate = new Date(newDurationMs);
      const hasVipExpired = vipmember.duration.getTime() < Date.now();
      await vipmember.update({
        duration: !hasVipExpired ? newDate : new Date(Date.now() + durationSec * 1000),
        type: translated.default,
        status: "on",
        name: targetMember.user.username,
        guild_id: targetMember.guild.id,
      });
      console.log({ e: vipmember.type });
      return message.reply({
        embeds: [addedVipEmbed(client.secondsToDays(durationSec), targetMember, translated.aliases[0])],
      });
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};

function buildDurationRegex(map: Duration[]) {
  const allAliases = map.flatMap((obj) => obj.alias);
  const escaped = allAliases.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`^(\\d+)\\s*(?:${escaped.join("|")})$`, "i");
}

function arrayToRegex(arr: string[]) {
  return new RegExp(`^(?:${arr.map((s) => escapeRegex(s)).join("|")})$`);
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
