import { APIVipMember, Optional, VipMember } from "@duque.edits/sdk";
import {
  ButtonInteraction,
  Guild,
  GuildMember,
  StringSelectMenuInteraction,
  EmbedBuilder,
  VoiceChannel,
} from "discord.js";

export default function (
  data: VipMember | Optional<APIVipMember>,
  interaction: StringSelectMenuInteraction | ButtonInteraction
) {
  const member = interaction.member as GuildMember;
  const memberRole = interaction.guild.roles.cache.get(data.roleId);
  const memberChannel = interaction.guild.channels.cache.get(data.voiceChannelId) as VoiceChannel;
  return new EmbedBuilder()
    .setColor(member.displayHexColor)
    .setTitle(`Informações | ${member.user.username}`)
    .setDescription(["Veja as informações do seu vip abaixo:"].join("\n"))
    .setFields([
      {
        name: "Tipo",
        value: data.type || "Call & Cargo",
        inline: true,
      },
      {
        name: "Cargo",
        value: memberRole?.toString() ?? `Cargo não encontrado`,
        inline: true,
      },
      {
        name: "Call",
        value: memberChannel?.toString() ?? `Canal não encontrado`,
        inline: true,
      },

      {
        name: "Criado em:",
        value: data.createdAt
          ? `<t:${Math.ceil(data.createdAt.getTime() / 1000)}:R>`
          : `<t:${Math.ceil(Date.now() / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Expiração em:",
        value: data.duration
          ? `<t:${Math.ceil(data.duration.getTime() / 1000)}:R>`
          : `<t:${Math.ceil(Date.now() / 1000)}:R>`,
        inline: true,
      },

      {
        name: "Membros adicionados:",
        value:
          memberRole?.members?.map((m) => m.toString()).join(", ") ??
          memberChannel?.members?.map((m) => m.toString()).join(", ") ??
          "Sem membros adicionados",
        inline: true,
      },
    ])
    .setThumbnail(interaction.user.displayAvatarURL());
}
