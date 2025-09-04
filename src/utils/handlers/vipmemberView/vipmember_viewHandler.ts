import rest, { VipMember } from "@duque.edits/sdk";
import { ButtonInteraction } from "discord.js";
import { Bot } from "../../../structures/Client";
import Embeds from "../../../structures/Embeds";
import vipInfoEmbed from "../../Embeds/vipInfoEmbed";
import generateVipMemberConfig from "../../panels/generateVipMemberConfig";

export default async function (client: Bot, guildApi: rest.Guild, interaction: ButtonInteraction) {
  try {
    const { customId } = interaction;
    const [_, action, pg] = customId.split("-");

    let page = Number(pg) ?? 0;

    const vipMembers = guildApi.vipMembers;
    let embeds = vipMembers.cache.map((m) => vipInfoEmbed(m, interaction));

    if (action === "back") page === 0 ? (page = 0) : --page;
    if (action === "foward") embeds[page] !== undefined ? ++page : page;
    if (action === "refresh") {
      await guildApi.vipMembers.fetchAll();
      embeds = vipMembers.cache.map((m) => vipInfoEmbed(m, interaction));
    }

    const vipmember = vipMembers.cache.at(page);
    if (!vipmember) return interaction.reply({ embeds: [Embeds.no_vip], flags: 64 });

    const { embed, row, row2 } = generateVipMemberConfig(page, embeds);
    return interaction.update({ embeds: [embed], components: [row, row2] });
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
