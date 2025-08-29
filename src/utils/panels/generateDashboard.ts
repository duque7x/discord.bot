import { EmbedBuilder, Colors, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export default function generateDashboard() {
    const embed = new EmbedBuilder()
        .setColor(Colors.LightGrey)
        .setTitle(`Configurar bot`)
        .setDescription(
            [
                `Abaixo, você encontrará um menu para ajustar as configurações do bot.`,
                `-# <:seta:1373287605852176424> Se tiveres uma dúvida chame a equipa de suporte.`
            ].join("\n")
        )
        .setTimestamp();

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .setComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`setup`)
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Categorias')
                        .setValue('categories')
                        .setDescription('Definir os tipos de ticket usados pelo bot')
                        .setEmoji('<:folders:1387526239652417679>'),
                ));
    return { embed, row };
}

