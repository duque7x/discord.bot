import { Guild, VipMember } from "@duque.edits/sdk";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuInteraction,
  UserSelectMenuBuilder,
} from "discord.js";
import { Bot } from "../../../../structures/Client";
import Messages from "../../../../structures/Messages";
import { VoiceChannel } from "discord.js";
import Embeds from "../../../../structures/Embeds";

export default async function (
  client: Bot,
  guildApi: Guild,
  interaction: StringSelectMenuInteraction,
  vipMember: VipMember
) {
  try {
    const embed = new EmbedBuilder()
      .setTitle("Configurar Membros | Configure Members")
      .setColor(0xfbff00)
      .setDescription(
        [
          `Que ação você deseja fazer?`,
          Messages.error_occurs,
          ``,
          `What action do you want to do?`,
          Messages.en_error_occurs,
        ].join("\n")
      )
      .setThumbnail(interaction.user.displayAvatarURL());

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("vip_member-members-add")
        .setLabel("Adicionar | Add")
        .setEmoji("<:people_green:1409964519190696058>"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("vip_member-members-remove")
        .setLabel("Remover | Remove")
        .setEmoji("<:people_red:1409964520881000539>")
    );

    await interaction.reply({ embeds: [embed], components: [row], flags: 64 });

    const reply = await interaction.fetchReply();

    const collector = reply.createMessageComponentCollector({
      filter: (c) => c.user.id === interaction.user.id && c.customId.startsWith("vip_member-members"),
      max: 10000000,
      time: 10 * 100 * 1000,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (int) => {
      const [_, __, action] = int.customId.split("-");
      const cc = `members_selection-${action}`;

      const { voiceChannelId, roleId } = vipMember;
      const vipmemberRole = int.guild.roles.cache.get(roleId);
      const vipmemberChannel = int.guild.channels.cache.get(voiceChannelId) as VoiceChannel;
      if (!vipmemberRole && !vipmemberChannel) {
        return int.reply({
          content: Messages.must_create_vip,
          flags: 64,
        });
      }
      const row = new ActionRowBuilder<UserSelectMenuBuilder>().setComponents(
        new UserSelectMenuBuilder().setCustomId(cc).setMaxValues(20)
      );
      const map: Record<string, string> = { add: "adicionar", remove: "remover" };

      await int.reply({
        content: [
          `Selecione os jogadores para os ${map[action]}.`,
          `-# ↪ Lembre-se do limite de jogadores.`,
          ``,
          `Select the players to ${action} them.`,
          `-# ↪ Rembember the max players.`,
        ].join("\n"),
        components: [row],
        flags: 64,
      });
      let reply = await int.fetchReply();

      const collector2 = reply.createMessageComponentCollector({
        filter: (c) => c.user.id === int.user.id && c.customId === cc,
        max: 1,
        componentType: ComponentType.UserSelect,
        time: 10 * 60 * 1000,
      });
      collector2.on("collect", async (i) => {
        await i.reply({
          content: [`-# ↪ Aguarde um momento...`, `-# ↪ Wait for a few moments...`].join("\n"),
          flags: 64,
        });
        const users = i.values;

        if (action === "add") {
          for (let userId of users) {
            const member = int.guild.members.cache.get(userId);

            if (vipmemberChannel && !vipmemberRole) {
              vipmemberChannel.permissionOverwrites.edit(userId, {
                Connect: true,
                ViewChannel: true,
              });
            }
            if (vipmemberRole) {
              const alreadyhasRole = member.roles.cache.has(vipmemberRole.id);
              if (!alreadyhasRole) member.roles.add(vipmemberRole.id);
            }
          }
          await i.editReply({
            content: [
              `Jogadores adicionados com sucesso.`,
              `-# ↪ Para os remover clique em 'Remover'.`,
              ``,
              `Players were added successfully.`,
              `-# ↪ To remove them click 'Remove'.`,
            ].join("\n"),
          });

          return;
        }
        if (action === "remove") {
          for (let userId of users) {
            const member = int.guild.members.cache.get(userId);

            if (vipmemberChannel && !vipmemberRole) {
              vipmemberChannel.permissionOverwrites.edit(userId, {
                Connect: false,
                ViewChannel: true,
              });
            }
            if (vipmemberRole) {
              const alreadyhasRole = member.roles.cache.has(vipmemberRole.id);
              if (alreadyhasRole) member.roles.remove(vipmemberRole.id);
            }

            await i.editReply({
              content: [
                `Jogadores removided com sucesso.`,
                `-# ↪ Para os adicionar clique em 'Adicionar'.`,
                ``,
                `Players were removed successfully.`,
                `-# ↪ To add them back click 'Add'.`,
              ].join("\n"),
            });
          }
          return;
        }
      });
    });
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
