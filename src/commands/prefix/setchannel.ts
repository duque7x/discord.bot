import { ChannelType, EmbedBuilder, GuildMemberRoleManager, Message, PermissionFlagsBits } from "discord.js";
import { Bot } from "../../structures/Client";
import generateDashboard from "../../utils/panels/generateDashboard";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import Messages from "../../structures/Messages";

export default {
  name: "setchannel",
  alias: ["setarcanal", "setarcall"],
  description: "Seta o canal no vip de um usuário.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const isAdmin = message.member.permissions?.has(PermissionFlagsBits.Administrator);
      const allowedRoles = guild.permissions.manage_bot;
      const hasRole = allowedRoles?.some((r) =>
        (message?.member?.roles as GuildMemberRoleManager).cache.some((r2) => r == r2.id)
      );

      if (!isAdmin && !hasRole) return message.delete();
      const argsWithOutMentions = args.filter((a) => !message.mentions.members.some((m) => m.toString() === a));

      const member = message.mentions.members.at(0) ?? message.member;
      const channel = message.mentions.channels.at(0) ?? message.guild.channels.cache.get(argsWithOutMentions[0]);
      console.log({ argsWithOutMentions });
      if (!channel) return message.reply(Messages.no_channel_mention);
      if (channel.type !== ChannelType.GuildVoice) return message.reply(Messages.must_be_voice);

      const hasVip = guild.vipMembers.cache.has(member.id);
      if (!hasVip) return message.reply({ embeds: [Embeds.no_vip] });

      const vipmember = guild.vipMembers.cache.get(member.id);
      await vipmember.update({ voiceChannelId: channel.id });

      const embed = new EmbedBuilder()
        .setTitle(`<:yes_green:1410952174544093204> Canal setado | Channel Linked`)
        .setDescription(
          [
            `O canal ${channel} foi associado com ${member}`,
            Messages.error_occurs,
            ``,
            `The channel ${channel} was linked to ${member}`,
            Messages.en_error_occurs,
          ].join("\n")
        )
        .setTimestamp()
        .setColor(0x00ff00)
        .setThumbnail(member.user.displayAvatarURL());

      await message.reply({ embeds: [embed] });
      const role = message.guild.roles.cache.get(vipmember.voiceChannelId);
      if (role) channel.permissionOverwrites.edit(role.id, { ViewChannel: true, Connect: true });
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};
