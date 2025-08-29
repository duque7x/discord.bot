import rest, { VipMember } from "@duque.edits/sdk";
import { StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../../structures/Client";
import Embeds from "../../../structures/Embeds";
import { info } from "./options/info";

export default async function (
  guildApi: rest.Guild,
  interaction: StringSelectMenuInteraction,
  value: string,
  client: Bot
) {
  try {
    const handlers: Record<
      string,
      (client: Bot, guildApi: rest.Guild, interaction: StringSelectMenuInteraction, vipmember: VipMember) => any
    > = {
      info,
    };
    const vipmember = guildApi.vipMembers.cache.get(interaction.user.id);
    if (!vipmember) return interaction.reply({ embeds: [Embeds.no_vip], flags: 64 });

    if (value.startsWith("separator")) return interaction.deferUpdate();
    const handler = handlers[value];
    if (handler) return handler(client, guildApi, interaction, vipmember);
  } catch (error) {
    await interaction.editReply({ embeds: [Embeds.error_occured] });
    return console.error(error);
  }
}
