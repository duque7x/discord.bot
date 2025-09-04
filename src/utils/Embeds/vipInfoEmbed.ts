import { APIVipMember, Optional, VipMember } from "@duque.edits/sdk";
import {
  ButtonInteraction,
  Guild,
  GuildMember,
  StringSelectMenuInteraction,
  EmbedBuilder,
  VoiceChannel,
  Message,
  User,
} from "discord.js";

export default function (
  data: VipMember | Optional<APIVipMember>,
  event: StringSelectMenuInteraction | ButtonInteraction | Message
) {
  const member = event.member as GuildMember;
  const memberRole = event.guild.roles.cache.get(data.roleId);
  const memberChannel = event.guild.channels.cache.get(data.voiceChannelId) as VoiceChannel;
  const typeMap: Record<string, string> = {
    both: "Call & Cargo",
    channel: "Call",
    role: "Cargo",
  };
  return new EmbedBuilder()
    .setColor(member.displayHexColor)
    .setTitle(`Informações | ${member.user.username}`)
    .setDescription(["Veja as informações do seu vip abaixo:"].join("\n"))
    .setFields([
      {
        name: "Tipo",
        value: `${typeMap[data.type]} | ${data.type}` || "Call & Cargo | Both",
        inline: true,
      },
      {
        name: "Cargo | Role",
        value: memberRole?.toString() ?? `Cargo não encontrado | Role not found`,
        inline: true,
      },
      {
        name: "Call | Channel",
        value: memberChannel?.toString() ?? `Canal não encontrado | Channel not found`,
        inline: true,
      },

      {
        name: "Criado em | Created At",
        value: data.createdAt
          ? `<t:${Math.ceil(data.createdAt.getTime() / 1000)}:R>`
          : `<t:${Math.ceil(Date.now() / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Expiração em | Expires in",
        value: data.duration
          ? `<t:${Math.ceil(data.duration.getTime() / 1000)}:R>`
          : `<t:${Math.ceil(Date.now() / 1000)}:R>`,
        inline: true,
      },

      {
        name: "Membros adicionados | Added members",
        value: `Membros com cargo (${memberRole?.members.size ?? memberChannel.members.size ?? 0}) \n${
          memberRole?.members
            ?.toJSON()
            .slice(0, 15)
            .map((m) => m.toString())
            .join(", ") ??
          memberChannel?.members
            ?.toJSON()
            .slice(0, 15)
            .map((m) => m.toString())
            .join(", ") ??
          "Sem membros adicionados (0) | No added members (0)"
        }`,
        inline: true,
      },
    ])
    .setThumbnail((event.member.user as User).displayAvatarURL());
}
