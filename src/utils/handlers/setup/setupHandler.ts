import rest from "@duque.edits/sdk";
import { StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../../structures/Client";
//import { categories } from "./options/categories";
import Embeds from "../../../structures/Embeds";

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
    > = {
    };
    if (value.startsWith("separator")) return interaction.deferUpdate();
    const handler = handlers[value];
    if (handler) return handler(guildApi, interaction, client);
  } catch (error) {
    await interaction.editReply({ embeds: [Embeds.error_occured] });
    return console.error(error);
  }
}
