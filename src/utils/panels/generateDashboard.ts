import {
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export default function generateDashboard() {
  const embed = new EmbedBuilder()
    .setColor(Colors.LightGrey)
    .setTitle(`Configurar bot`)
    .setDescription(
      [
        `Abaixo, você encontrará um menu para ajustar as configurações do bot.`,
        `-# ↪ Se tiveres uma dúvida chame a equipa de suporte.`,
      ].join("\n")
    )
    .setTimestamp();

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`setup`)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Categorias")
          .setValue("categories")
          .setDescription("Definir as categorias usadas pelo bot.")
          .setEmoji("<:channel_emoji_red:1409964549058199683>")
      )
  );
  return { embed, row };
}
