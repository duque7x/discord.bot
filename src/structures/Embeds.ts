import { EmbedBuilder } from "discord.js";
import Messages from "./Messages";

export default {
  error_occured: new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(`<:info_red:1409964515809955861> Erro | Error`)
    .setDescription(
      [
        `Ocorreu um erro quando você usou este comando!`,
        Messages.error_occurs,
        ``,
        `There was an error when you used this command!`,
        Messages.en_error_occurs,
      ].join("\n")
    )
    .setTimestamp(),
  no_vip: new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(`<:info_red:1409964515809955861> Sem acesso | No access`)
    .setDescription(
      [
        `Você **não tem acesso** ao painel vip.`,
        Messages.error_occurs,
        ``,
        `You **don't have access** to the vip painel.`,
        Messages.en_error_occurs,
      ].join("\n")
    )
    .setTimestamp(),
  expired_vip: new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(`<:info_red:1409964515809955861> Sem acesso | No access`)
    .setDescription(
      [
        `O tempo do seu **vip acabou**!`,
        Messages.error_occurs,
        ``,
        `Your vip time **has expired**!`,
        Messages.en_error_occurs,
      ].join("\n")
    )
    .setTimestamp(),
};
