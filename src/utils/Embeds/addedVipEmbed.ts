import { GuildMember, EmbedBuilder } from "discord.js";

export default function (duration_in_days: number, member: GuildMember, vip_type: string) {
  return new EmbedBuilder()
    .setTitle(`<:yes_green:1410952174544093204> Vip Adicionado | Vip Added`)
    .setDescription(
      [
        `Vip foi adicionado a ${member} com sucesso.`,
        duration_in_days < 364
          ? `-# <:seta:1412704526879948924> Duração adicionada: **${duration_in_days} dias.**`
          : `-# <:seta:1412704526879948924> Duração adicionada: **${Math.floor(duration_in_days / 364)} ano(s).**`,
        `-# <:seta:1412704526879948924> Tipo adicionado: **${vip_type}.**`,
      ].join("\n")
    )
    .setTimestamp()
    .setColor(0x00ff00)
    .setThumbnail(member.user.displayAvatarURL());
}
