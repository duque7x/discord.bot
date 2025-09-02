import {
  ActionRowBuilder,
  Colors,
  EmbedBuilder,
  GuildMemberRoleManager,
  Interaction,
  MessageFlags,
  ModalBuilder,
  PermissionFlagsBits,
  Role,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Bot } from "../structures/Client";
import { SlashCommand } from "../types/SlashCommand";
import setupHandler from "../utils/handlers/setup/setupHandler";
import rest from "@duque.edits/sdk";
import vipPainelHandler from "../utils/handlers/vip_painel/vipPainelHandler";
import configHandler from "../utils/handlers/config/configHandler";

const Reset = "\x1b[0m";
const FgCyan = "\x1b[36m";
const FgRed = "\x1b[31m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";

const event = {
  name: "interactionCreate",

  async execute(client: Bot, interaction: Interaction) {
    try {
      const guildApi = client.api.guilds.cache.get(interaction.guildId);

      const isAdmin = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);
      const allowedRoles = guildApi?.roles?.find((r) => r.type == "team")?.ids;
      const hasRole = allowedRoles?.some((r) =>
        (interaction?.member?.roles as GuildMemberRoleManager).cache.some((r2: Role) => r == r2.id)
      );

      if (interaction.isChatInputCommand()) {
        const command: SlashCommand | undefined = client.slashCommands.find(
          (command) => command.data.name === interaction.commandName
        );
        if (!command) return;
        if (command.adminOnly && !isAdmin && !hasRole) {
          console.log(
            FgRed +
              `${interaction.user.tag} tentou usar o comando ${command.data.name} mais não tem permissões 🤣.` +
              Reset
          );
          return interaction.reply({ content: `**Pensou** né?`, flags: 64 });
        }
        console.log(
          FgCyan +
            `${interaction.user.tag} - ${interaction.user.id} usou o bot as ${new Date().toISOString()} comando: ${
              command.data.name
            }` +
            Reset
        );
        return command.execute(client, interaction, guildApi);
      }

      if (interaction.isStringSelectMenu()) {
        const { customId, values } = interaction;
        const [action, field] = customId.split("-");
        const value = values[0];

        console.log(
          FgYellow +
            `${interaction.user.tag} - ${
              interaction.user.id
            } usou o bot as ${new Date().toISOString()}. CustomId: ${customId}` +
            Reset
        );

        if (value.startsWith("separator") || action.startsWith("separator")) return interaction.deferUpdate();

        if (customId === "setup") {
          if (!isAdmin && !hasRole)
            return interaction.reply({
              content: "Você não tem permissões para usar este comando!",
              flags: MessageFlags.Ephemeral,
            });
          return setupHandler(guildApi as rest.Guild, interaction, value, client);
        }
        if (customId === "vip_painel") return vipPainelHandler(guildApi as rest.Guild, interaction, value, client);

        if (action === "config") return configHandler(guildApi, interaction, client);
      }
    } catch (error) {
      console.error(error);
    }
  },
};

export default event;
