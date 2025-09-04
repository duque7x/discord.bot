import { Collection } from "@duque.edits/sdk";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export default function(page: number, embeds: EmbedBuilder[]) {
    if (page < 0) page = 0;
    embeds[page];
    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId(`vipmember_view-back-${page}`)
        .setDisabled(page === 0)
        .setEmoji(process.env.LEFT_EMOJI)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`vipmember_view-refresh-${page}`)
        .setEmoji(process.env.REFRESH_EMOJI)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`vipmember_view-foward-${page}`)
        .setDisabled(embeds[page] === undefined)
        .setEmoji(process.env.RIGHT_EMOJI)
        .setStyle(ButtonStyle.Secondary)
    );
    const row2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId(`vipmember_view-delete-${page}`)
        .setLabel("Apagar Vip | Delete Vip")
        .setEmoji("<:yes_red:1409964517307453631>")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`vipmember_view-add_time-${page}`)
        .setEmoji("<:yes_green:1410952174544093204>")
        .setLabel("Adicionar Tempo | Add Time")
        .setStyle(ButtonStyle.Success)
    );
    return { embed: embeds[page], row, row2 };
}