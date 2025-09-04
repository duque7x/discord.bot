import { Guild, VipMember } from "@duque.edits/sdk";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";
import { Bot } from "../../../../structures/Client";
import vipInfoEmbed from "../../../Embeds/vipInfoEmbed";
import Messages from "../../../../structures/Messages";
import { StringSelectMenuOptionBuilder } from "discord.js";
import configRoleRow from "../../../rows/configRoleRow";
import configChannelRow from "../../../rows/configChannelRow";
import vipCreationPanel from "../../../panels/vipCreationPanel";
import Embeds from "../../../../structures/Embeds";

export default async function (
  client: Bot,
  guildApi: Guild,
  interaction: StringSelectMenuInteraction,
  vipMember: VipMember
) {
  try {
    const { embed, row } = vipCreationPanel(vipMember, interaction);
    await interaction.reply({ embeds: [embed], components: [row], flags: 64 });

    const reply = await interaction.fetchReply();
    const collector = reply.createMessageComponentCollector({
      filter: (c) =>
        c.user.id === vipMember.id &&
        (c.customId === "vip_member-create-voice" || c.customId === "vip_member-create-role"),
      componentType: ComponentType.Button,
      max: 20,
      time: 10 * 60 * 1000,
    });

    collector.on("collect", async (int) => {
      const [_, __, option] = int.customId.split("-");

      const translatedOptionMap: Record<string, string> = { voice: "canal", role: "cargo" };
      const intChannel = int.channel as TextChannel;
      const memberMention = vipMember.toString();

      const thread = await intChannel.threads.create({
        name: `${translatedOptionMap[option]}-${int.user.username.slice(0, 15)}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        invitable: false,
        type: ChannelType.PrivateThread,
        reason: `User has to create his ${option}`,
      });

      if (option === "role") {
        const embed = new EmbedBuilder()
          .setTitle("Configurar Cargo | Configure Cargo")
          .setColor(Colors.Aqua)
          .setThumbnail(process.env.ICONURL)
          .setDescription(
            [
              `Usa a seleção abaixo para configurar o teu cargo.`,
              Messages.error_occurs,
              "",
              `Use the selecion below to configure your role.`,
              Messages.en_error_occurs,
            ].join("\n")
          );
        thread.send({ content: memberMention, embeds: [embed], components: [configRoleRow(vipMember.id)] });
      }
      if (option === "voice") {
        const embed = new EmbedBuilder()
          .setTitle("Configurar Canal | Configure Channel")
          .setColor(Colors.Purple)
          .setThumbnail(process.env.ICONURL)
          .setDescription(
            [
              `Usa a seleção abaixo para configurar o teu canal.`,
              Messages.error_occurs,
              "",
              `Use the selecion below to configure your channel.`,
              Messages.en_error_occurs,
            ].join("\n")
          );

        thread.send({ content: memberMention, embeds: [embed], components: [configChannelRow(vipMember.id)] });
      }
      await int.reply({
        content: [
          `Você pode acabar de criar o seu **${translatedOptionMap[option]}** [aqui](${thread.url}).`,
          Messages.error_occurs,
          "",
          `You can finish creating your **${option}** [here](${thread.url}).`,
          Messages.en_error_occurs,
        ].join("\n"),
        flags: 64,
      });
    });
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
