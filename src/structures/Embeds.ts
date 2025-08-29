import { EmbedBuilder } from "discord.js";

export default {
  error_occured: new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(`<:info_red:1409964515809955861> Erro`)
    .setDescription(
      [
        `Ocorreu um erro quando você usou este comando!`,
        `-# ↪ Se isto foi um erro entre em contacto a administração do servidor.`,
      ].join("\n")
    )
    .setTimestamp(),
  no_vip: new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(`<:info_red:1409964515809955861> Sem acesso`)
    .setDescription(
      [
        `Você não tem acesso ao painel vip.`,
        `-# ↪ Se isto foi um erro entre em contacto a administração do servidor.`,
      ].join("\n")
    )
    .setTimestamp(),
};
