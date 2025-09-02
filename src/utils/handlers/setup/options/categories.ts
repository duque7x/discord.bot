import {
  StringSelectMenuInteraction,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  ComponentType,
  MessageFlags,
} from "discord.js";
import rest, { Collection } from "@duque.edits/sdk";
import generateDashboard from "../../../panels/generateDashboard";
import { Bot } from "../../../../structures/Client";
import Embeds from "../../../../structures/Embeds";

type Channel = {
  type: string;
  ids: string[];
};
type Categories = Collection<string, Channel>;

export default async function (guildApi: rest.Guild, interaction: StringSelectMenuInteraction, client: Bot) {
  try {
    await interaction.deferUpdate();

    const { channel, member } = interaction;

    const menuEmbed = (categories: Categories) => {
      let voiceCategory = categories
        ?.find((cn) => cn.type === "vipmembers_category")
        ?.ids?.filter((id) => interaction.guild.channels.cache.find((c) => c.id == id) !== null)
        .map((id) => `<#${id}> (${id})`)
        .join(", ");

      return new EmbedBuilder()
        .setColor(Colors.LightGrey)
        .setTitle("Categorias")
        .setDescription(
          [
            `Neste menu você pode adicionar ou remover categorias de uma certa especialidade`,
            `\n <:channel_emoji_red:1409964549058199683> → **Categoria Voz pros Canais:** ${
              voiceCategory || `Não há uma categorias guardadas`
            }`,
          ].join("\n")
        )
        .setTimestamp();
    };

    const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("categoriesdb_change")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setValue("vipmembers_category")
            .setEmoji(`<:channel_emoji_red:1409964549058199683>`)
            .setLabel("Categoria Voz pros Canais")
            .setDescription(`Definir esta a categoria voz pros canais dos membros.`),
          new StringSelectMenuOptionBuilder().setLabel("\u200b").setValue("separator1"),
          new StringSelectMenuOptionBuilder()
            .setValue("db_menu")
            .setEmoji(process.env.LEFT_EMOJI)
            .setLabel("Voltar ao menu principal")
        )
    );

    const msg = await interaction.message.edit({
      embeds: [menuEmbed(guildApi.categories.cache)],
      components: [menuRow],
    });

    const collector = msg?.createMessageComponentCollector({
      filter: (c) => c.customId == "categoriesdb_change" && c.user.id === member?.user.id,
      max: 50,
      time: 540_000,
      componentType: ComponentType.StringSelect,
    });

    collector?.on("collect", async (int: StringSelectMenuInteraction) => {
      const value = int.values[0];
      if (value.startsWith("separator")) return int.deferUpdate();

      if (value == "db_menu") {
        const { embed, row } = generateDashboard();
        collector.stop();
        return int.update({ embeds: [embed], components: [row] });
      }

      await int.deferReply({ flags: MessageFlags.Ephemeral });

      const translateField: Record<string, string> = {
        vipmembers_category: "canais voz membros",
      };

      const baseEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTimestamp()
        .setTitle("Adicionar/Remover Categoria")
        .setDescription(
          [
            `Use a seleção para adicionar ou remover umas das categorias ${translateField[value]}`,
            "-# ↪ Você tem **2 minutos**!",
          ].join("\n")
        );

      const addOrRemoveSelection = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("add_remove_cate_slc")
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setValue(`add-${value}`)
              .setEmoji("<:add:1387526168349245502>")
              .setLabel("Adicionar uma categoria")
              .setDescription(`Clique para adicionar uma categoria específica`),
            new StringSelectMenuOptionBuilder()
              .setValue(`remove-${value}`)
              .setEmoji("<:remove:1387526179732459642>")
              .setLabel("Remover uma categoria")
              .setDescription(`Clique para remover uma categoria específica`)
          )
      );

      const selectEditedMsg = await int.editReply({ embeds: [baseEmbed], components: [addOrRemoveSelection] });

      const collector2 = selectEditedMsg.createMessageComponentCollector({
        filter: (c) => c.customId == "add_remove_cate_slc" && c.user.id == int.user.id,
        time: 120_000,
        max: 1,
        componentType: ComponentType.StringSelect,
      });

      collector2.on("collect", async (i) => {
        await i.deferUpdate();

        const [vl, categoryType] = i.values[0].split("-");
        const category =
          guildApi.categories.cache.get(categoryType) ?? (await guildApi.categories.create({ type: categoryType }));

        const channelSelect = new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId(`channelselect-${vl}`)
            .setMaxValues(5)
            .addChannelTypes(ChannelType.GuildCategory)
        );

        if (vl == "add") {
          baseEmbed
            .setTitle(`Categoria ${translateField[categoryType]}`)
            .setColor(0xff8a00)
            .setDescription(["Use a seleção para adicionar uma categoria:", "-# ↪ Você tem **2 minutos**!"].join("\n"));

          const editedReply = await i.editReply({ embeds: [baseEmbed], components: [channelSelect] });

          const collector3 = editedReply.createMessageComponentCollector({
            componentType: ComponentType.ChannelSelect,
            filter: (c) => c.customId == `channelselect-${vl}` && c.user.id == int.user.id,
            time: 120_000,
            max: 1,
          });

          collector3.on("collect", async (interact) => {
            await Promise.all([interact.deferUpdate(), i.deleteReply()]);

            for (let categoryId of interact.values) {
              await category.addId(categoryId);
            }
            return interaction.message.edit({
              embeds: [menuEmbed(await guildApi.categories.fetchAll())],
              components: [menuRow],
            });
          });
        }
        if (vl == "remove") {
          baseEmbed
            .setTitle(`Categoria ${translateField[categoryType]}`)
            .setColor(0x713d00)
            .setDescription(["Use a seleção para remover uma categoria:", "-# ↪ Você tem **2 minutos**!"].join("\n"));
          const channelSelect = new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
            new ChannelSelectMenuBuilder()
              .setCustomId(`channelselect-${vl}`)
              .setMaxValues(category.ids.length)
              .addChannelTypes(ChannelType.GuildCategory)
              .addDefaultChannels(...category.ids)
          );
          const editedReply = await i.editReply({ embeds: [baseEmbed], components: [channelSelect] });

          const collector3 = editedReply.createMessageComponentCollector({
            componentType: ComponentType.ChannelSelect,
            filter: (c) => c.customId == `channelselect-${vl}` && c.user.id == int.user.id,
            time: 120_000,
            max: 1,
          });

          collector3.on("collect", async (interact) => {
            await Promise.all([interact.deferUpdate(), i.deleteReply()]);

            for (let categoryId of interact.values) {
              await category.removeId(categoryId);
            }
            return interaction.message.edit({
              embeds: [menuEmbed(await guildApi.categories.fetchAll())],
              components: [menuRow],
            });
          });
        }
      });
    });
  } catch (error) {
    if (interaction.replied || interaction.deferred)
      interaction.editReply({ embeds: [Embeds.error_occured], components: [], content: "" });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
