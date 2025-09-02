import rest from "@duque.edits/sdk";
import { StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../../structures/Client";
import Embeds from "../../../structures/Embeds";
import categories from "./options/categories";

export default async function (
  guildApi: rest.Guild,
  interaction: StringSelectMenuInteraction,
  value: string,
  client: Bot
) {
  try {
    const handlers: Record<
      string,
      (guildApi: rest.Guild, interaction: StringSelectMenuInteraction, client: Bot) => any
    > = { categories };
    if (value.startsWith("separator")) return interaction.deferUpdate();
    const handler = handlers[value];
    if (handler) return handler(guildApi, interaction, client);
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
