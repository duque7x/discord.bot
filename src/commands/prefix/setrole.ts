import {
  ChannelType,
  EmbedBuilder,
  GuildMemberRoleManager,
  Message,
  PermissionFlagsBits,
  VoiceChannel,
} from "discord.js";
import { Bot } from "../../structures/Client";
import generateDashboard from "../../utils/panels/generateDashboard";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import Messages from "../../structures/Messages";

export default {
  name: "setrole",
  alias: ["setarcargo", "setcargo"],
  description: "Seta o cargo no vip de um usuário.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const isAdmin = message.member.permissions?.has(PermissionFlagsBits.Administrator);
      const allowedRoles = guild.roles.find((r) => r.type == "team")?.ids;
      const hasRole = allowedRoles?.some((r) =>
        (message?.member?.roles as GuildMemberRoleManager).cache.some((r2) => r == r2.id)
      );

      if (!isAdmin && !hasRole) return message.delete();

      const member = message.mentions.members.at(0) ?? message.member;
      const role = message.mentions.roles.at(0);

      if (!role) return message.reply(Messages.no_role_mention);

      const hasVip = guild.vipMembers.cache.has(member.id);
      if (!hasVip) return message.reply({ embeds: [Embeds.no_vip] });

      const vipmember = guild.vipMembers.cache.get(member.id);
      await vipmember.update({ roleId: role.id });

      const embed = new EmbedBuilder()
        .setTitle(`<:yes_green:1410952174544093204> Cargo setado | Role Linked`)
        .setDescription(
          [
            `O cargo ${role} foi associado com ${member}`,
            Messages.error_occurs,
            ``,
            `The role ${role} was linked to ${member}`,
            Messages.en_error_occurs,
          ].join("\n")
        )
        .setTimestamp()
        .setColor(0x00ff00)
        .setThumbnail(member.user.displayAvatarURL());

      await message.reply({ embeds: [embed] });

      const channel = message.guild.channels.cache.get(vipmember.voiceChannelId) as VoiceChannel;
      if (channel) channel.permissionOverwrites.edit(role.id, { ViewChannel: true, Connect: true });
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};
