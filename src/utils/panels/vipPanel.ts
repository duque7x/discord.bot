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
      [
        `No menu abaixo, você pode **configurar o seu VIP**.`,
        `-# Opções como informações do vip, criar cargo ou canal privado e a configuração dos membros.`,
        ``,
        "In the selection below, you can **configure your VIP**.",
        "-# Options such as information of vip, create private role or channel and configuration of the members.",
      ].join("\n")
    )
    .setThumbnail(process.env.ICONURL);
process.env.ICONURL
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`vip_painel`)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setValue(`info`)
          .setLabel("Ver informações | See Information")
          .setDescription("Mostra as informações do seu vip.")
          .setEmoji(`<:info:1409964522575495388>`),
        new StringSelectMenuOptionBuilder().setLabel("\u200b").setValue("separator1"),
        new StringSelectMenuOptionBuilder()
          .setValue(`create`)
          .setLabel("Criar cargo ou canal | Create role or channel")
          .setDescription("Criar cargo ou canal privado.")
          .setEmoji(`<:add_green:1409964526132269226>`),
        new StringSelectMenuOptionBuilder()
          .setValue("members")
          .setLabel("Configurar membros | Configure Members")
          .setDescription("Adicionar ou remover membros")
          .setEmoji("<:unkown:1412428225417842698>")
      )
      .setPlaceholder("Selecione uma das opções acima.")
  );

  return { row, embed };
}
