import {
  StringSelectMenuInteraction,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction,
} from "discord.js";
import rest, { Guild } from "@duque.edits/sdk";
import generateDashboard from "../../../panels/generateDashboard";
import { Bot } from "../../../../structures/Client";

export async function permissions(guildApi: rest.Guild, interaction: StringSelectMenuInteraction, client: Bot) {
  try {
    await interaction.deferUpdate();
    const { channel, member } = interaction;

    const menuEmbed = (guild: Guild) => {
      const manage_bot =
        guild.permissions?.manage_bot
          ?.filter((id) => interaction.guild.roles.cache.has(id))
          .map((id) => `<@&${id}> (${id})`)
          .join(", ") || "Sem cargos adicionados.";

      return new EmbedBuilder()
        .setColor(Colors.LightGrey)
        .setTitle("Permissões")
        .setDescription(
          [
            `Neste menu adicionar cargos para configurar o bot.`,
            `\n <:code:1409964623809089576> → **Mexer no bot:** ${manage_bot}`,
          ].join("\n")
        )
        .setTimestamp();
    };

    const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("permissionsdb_change")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setValue("manage_bot")
            .setEmoji(`<:code:1409964623809089576>`)
            .setLabel("Permissão de configurar bot")
            .setDescription(`Adicionar ou remover cargos com esta permissão`),
          new StringSelectMenuOptionBuilder().setLabel("\u200b").setValue("separator1"),
          new StringSelectMenuOptionBuilder()
            .setValue("db_menu")
            .setEmoji(process.env.LEFT_EMOJI)
            .setLabel("Voltar ao menu principal")
        )
    );

    const msg = await interaction.message.edit({ embeds: [menuEmbed(guildApi)], components: [menuRow] });

    const collector = msg.createMessageComponentCollector({
      filter: (c) => c.customId === "permissionsdb_change" && c.user.id === member?.user.id,
      max: 50,
      time: 540_000,
      componentType: ComponentType.StringSelect,
    });

    collector.on("collect", async (int: StringSelectMenuInteraction) => {
      const value = int.values[0];
      if (value.startsWith("separator")) return int.deferUpdate();

      if (value === "db_menu") {
        const { embed, row } = generateDashboard();
        collector.stop();
        return await int.update({ embeds: [embed], components: [row] });
      }

      const perm = value as keyof typeof guildApi.permissions;

      const translateField: Record<keyof typeof guildApi.permissions, string> = {
        manage_bot: "configurar bot",
        manage_matches: "gerenciar filas",
        manage_scores: "pontuação",
        manage_rooms: "gerenciar salas",
      };

      const baseEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTimestamp()
        .setTitle("Adicionar/Remover Permissão")
        .setDescription(
          [
            `Use a seleção para adicionar ou remover um cargo de ${translateField[perm]}`,
            "-# ↪ Você tem **2 minutos**!",
          ].join("\n")
        );

      const addOrRemoveSelection = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("add_remove_perm_slc")
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setValue(`add-${perm}`)
              .setEmoji("<:add_green:1409964526132269226>")
              .setLabel("Adicionar cargo")
              .setDescription(`Clique para selecionar um cargo`),
            new StringSelectMenuOptionBuilder()
              .setValue(`remove-${perm}`)
              .setEmoji("<:remove_red:1410964873055174738>")
              .setLabel("Remover cargo")
              .setDescription(`Clique para selecionar um cargo`)
          )
      );

      const selectEditedMsg = await int.reply({
        embeds: [baseEmbed],
        components: [addOrRemoveSelection],
        withResponse: true,
        flags: 64,
      });

      const collector2 = selectEditedMsg.resource.message.createMessageComponentCollector({
        filter: (c) => c.customId === "add_remove_perm_slc" && c.user.id === int.user.id,
        time: 120_000,
        max: 1,
        componentType: ComponentType.StringSelect,
      });

      collector2.on("collect", async (i) => {
        await i.deferUpdate();
        const [mode] = i.values[0].split("-");

        const roleSelect = new ActionRowBuilder<RoleSelectMenuBuilder>().setComponents(
          new RoleSelectMenuBuilder().setCustomId(`role_select-${mode}`).setMaxValues(5)
        );

        if (mode === "add") {
          baseEmbed
            .setTitle(`Permissão ${translateField[perm]}`)
            .setColor(Colors.Orange)
            .setDescription(["Use a seleção para adicionar uma permissão:", "-# ↪ Você tem **2 minutos**!"].join("\n"));

          const editedReply = await i.editReply({ embeds: [baseEmbed], components: [roleSelect] });

          const collector3 = editedReply.createMessageComponentCollector({
            componentType: ComponentType.RoleSelect,
            filter: (c) => c.customId === `role_select-${mode}` && c.user.id === int.user.id,
            time: 120_000,
            max: 1,
          });

          collector3.on("collect", async (interact) => {
            await Promise.all([interact.deferUpdate(), i.deleteReply()]);
            for (const roleId of interact.values) {
              await guildApi.permissionsManager.addId(perm, roleId);
            }

            return interaction.message.edit({ embeds: [menuEmbed(guildApi)], components: [menuRow] });
          });
        }

        if (mode === "remove") {
          const apiPerm = guildApi.permissions[perm] ?? [];

          baseEmbed
            .setTitle(`Permissão ${translateField[perm]}`)
            .setColor(0x713d00)
            .setDescription(["Use a seleção para remover um cargo:", "-# ↪ Você tem **2 minutos**!"].join("\n"));

          const roleSelect = new ActionRowBuilder<RoleSelectMenuBuilder>().setComponents(
            new RoleSelectMenuBuilder()
              .setCustomId(`role_select-${mode}`)
              .setMaxValues(apiPerm.length)
              .addDefaultRoles(...apiPerm.slice(0, 25)) // limite do Discord
          );

          const editedReply = await i.editReply({ embeds: [baseEmbed], components: [roleSelect] });

          const collector3 = editedReply.createMessageComponentCollector({
            componentType: ComponentType.RoleSelect,
            filter: (c) => c.customId === `role_select-${mode}` && c.user.id === int.user.id,
            time: 120_000,
            max: 1,
          });

          collector3.on("collect", async (interact) => {
            await Promise.all([interact.deferUpdate(), i.deleteReply()]);
            for (const roleId of interact.values) {
              await guildApi.permissionsManager.removeId(perm, roleId);
            }

            return interaction.message.edit({ embeds: [menuEmbed(guildApi)], components: [menuRow] });
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}
