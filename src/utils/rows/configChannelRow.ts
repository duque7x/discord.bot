import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export default function (userId: string) {
  return new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    new StringSelectMenuBuilder().setCustomId(`config-channel-${userId}`).setOptions(
      new StringSelectMenuOptionBuilder()
        .setDescription("Nome do canal | Channel's name")
        .setEmoji("<:pen:1409964589537562715>")
        .setLabel("Nome | Name")
        .setValue("name"),

      new StringSelectMenuOptionBuilder().setLabel("\u200b").setValue("separator1"),

      new StringSelectMenuOptionBuilder()
        .setDescription("Finalizar Processo | Finish process")
        .setEmoji("<:yes_green:1410952174544093204>")
        .setLabel("Fechar Canal | Close Channel")
        .setValue("close")
    )
  );
}
