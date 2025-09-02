import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export default function (userId: string) {
  return new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    new StringSelectMenuBuilder().setCustomId(`config-role-${userId}`).setOptions(
      new StringSelectMenuOptionBuilder()
        .setDescription("Nome do cargo | Role's name")
        .setEmoji("<:pen:1409964589537562715>")
        .setLabel("Nome | Name")
        .setValue("name"),
      new StringSelectMenuOptionBuilder()
        .setDescription("Cor do cargo | Role's color")
        .setEmoji("<:pallete:1412448660561596496>")
        .setLabel("Cor | Color")
        .setValue("color"),
      new StringSelectMenuOptionBuilder()
        .setDescription("Icone do cargo | Role's icon")
        .setEmoji("<:diamond:1412448909883867157>")
        .setLabel("Icone | Icon")
        .setValue("icon"),

      new StringSelectMenuOptionBuilder().setLabel("\u200b").setValue("separator2"),
      new StringSelectMenuOptionBuilder()
        .setDescription("Finalizar Processo | Finish process")
        .setEmoji("<:yes_green:1410952174544093204>")
        .setLabel("Fechar Canal | Close Channel")
        .setValue("close")
    )
  );
}
