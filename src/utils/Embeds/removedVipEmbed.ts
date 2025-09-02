import { GuildMember, EmbedBuilder } from "discord.js";

export default function (duration_in_days: number, member: GuildMember, resting_duration_in_days?: number) {
  return resting_duration_in_days !== 0
    ? new EmbedBuilder()
        .setTitle(`<:yes_red:1409964517307453631> Duração reduzida | Duration reduced`)
        .setDescription(
          [
            `Redução em ${member} realizada com sucesso.`,
            duration_in_days < 364
              ? `-# ↪ Duração reduzida: **${duration_in_days} dias.**`
              : `-# ↪ Duração reduzida: **${Math.floor(duration_in_days / 364)} ano(s).**`,
            `-# ↪ Duração restante: **${Math.floor(resting_duration_in_days / 364)} ano(s).**`,
          ].join("\n")
        )
        .setTimestamp()
        .setColor(0xff0000)
        .setThumbnail(member.user.displayAvatarURL())
    : new EmbedBuilder()
        .setTitle(`<:yes_red:1409964517307453631> Vip Removido | Vip Removed`)
        .setDescription([`Vip foi removido a ${member} com sucesso.`, `-# ↪ Duração restante: **0 horas.**`].join("\n"))
        .setTimestamp()
        .setColor(0xff0000)
        .setThumbnail(member.user.displayAvatarURL());
}
