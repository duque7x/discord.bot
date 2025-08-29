import {
  ActionRowBuilder,
  Colors,
  EmbedBuilder,
  Guild,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export function vipPanel(guild: Guild) {
  const embed = new EmbedBuilder()
    .setTitle("Painel VIP")
    .setColor(Colors.Gold)
    .setDescription(
      "No menu abaixo, você pode configurar o seu VIP. Também é possível visualizar informações como: quem possui o cargo, quando ele foi criado e muito mais."
    )
    .setThumbnail(guild.iconURL({ extension: "jpg", size: 512 }));

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`vip_painel`)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setValue(`info`)
          .setLabel("Ver informações")
          .setDescription("Mostra as informações do seu vip.")
          .setEmoji(`<:info:1407336252847427675>`),
        new StringSelectMenuOptionBuilder().setLabel("\u200b").setValue("separator1"),

        new StringSelectMenuOptionBuilder()
          .setValue(`create`)
          .setLabel("Criar cargo ou canal")
          .setDescription("Criar cargo ou canal privado.")
          .setEmoji(`<:add_green:1409964526132269226>`),
        new StringSelectMenuOptionBuilder()
          .setValue(`delete`)
          .setLabel("Apagar cargo ou canal")
          .setDescription("Apagar cargo ou canal privado.")
          .setEmoji(`<:remove_red:1410964873055174738>`)
      )
      .setPlaceholder("Selecione uma das opções acima.")
  );

  return { row, embed };
}
