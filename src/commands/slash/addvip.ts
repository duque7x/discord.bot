import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Bot } from "../../structures/Client";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import addedVipEmbed from "../../utils/Embeds/addedVipEmbed";

type AvailableVipMemberTypes = "both" | "channel" | "role";

export default {
  adminOnly: true,
  data: new SlashCommandBuilder()
    .setName("addvip")
    .setDescription("Adicionar acesso ao painel vip a um usuário.")
    .addUserOption((op) => op.setName("usuário").setDescription("Usuário para adicionar").setRequired(true))
    .addStringOption((op) =>
      op
        .setName("tipo")
        .setDescription("Tipo do vip")
        .setChoices([
          {
            name: "ambos",
            value: "both",
          },
          {
            name: "cargo",
            value: "role",
          },
          {
            name: "canal",
            value: "channel",
          },
        ])
        .setRequired(true)
    )
    .addStringOption((op) => op.setName("duração").setDescription("Duração para adicionar")),
  async execute(client: Bot, interaction: ChatInputCommandInteraction, guild: Guild) {
    try {
      await interaction.reply({ content: "# <:info_laranje:1409964513578717214> `|` Adicionando o vip...", flags: 64 });

      const user = interaction.options.getUser("usuário") ?? interaction.user;
      const type = interaction.options.getString("tipo") as AvailableVipMemberTypes;
      const duration = interaction.options.getString("duração");

      const resolvedDuration = client.resolveDuration(duration) ?? 7 * 24 * 60 * 60;

      let vipmember = guild.vipMembers.cache.get(user.id);
      const hadVip = guild.vipMembers.cache.has(user.id);

      if (!hadVip) {
        vipmember = await guild.vipMembers.create({
          type: type,
          status: "on",
          name: user.username,
          id: user.id,
          guild_id: interaction.guild.id,
        });
      }
      const durationHad = vipmember.duration ? new Date(vipmember.duration) : new Date();
      const newDurationMs = durationHad.getTime() + resolvedDuration * 1000;
      const newDate = new Date(newDurationMs);

      const hasVipExpired = vipmember.duration.getTime() < Date.now();
      await vipmember.update({
        duration: !hasVipExpired ? newDate : new Date(Date.now() + resolvedDuration * 1000),
        type,
        status: "on",
        name: user.username,
        guild_id: interaction.guild.id,
      });
      return interaction.editReply({
        embeds: [addedVipEmbed(resolvedDuration, interaction.guild.members.cache.get(user.id), type)],
      });
    } catch (error) {
      if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
      else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
      return console.error(error);
    }
  },
};
