import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export interface SelectionColor {
  emoji: string;
  name: string;
  hex: `#${string}`;
}

export default function () {
  const colors: SelectionColor[] = [
    { name: "Branco | White", hex: "#FFFFFF", emoji: "<:color_white:1412500876827820042>" },

    { name: "Preto | Black", hex: "#040404", emoji: "<:color_black:1412500105646440518>" },
    { name: "Rosa | Pink", hex: "#FFC0CB", emoji: "<:color_pink:1412500113125019759>" },

    { name: "Vermelho | Red", hex: "#FF0000", emoji: "<:color_red:1412500093667377254>" },
    { name: "Azul | Blue", hex: "#0000FF", emoji: "<:color_blue:1412500122868387911>" },

    { name: "Verde | Green", hex: "#008000", emoji: "<:color_green:1412500150471102464>" },
    { name: "Amarelo | Yellow", hex: "#FFFF00", emoji: "<:color_yellow:1412500130141311219>" },
    { name: "Laranja | Orange", hex: "#FFA500", emoji: "<:color_orange:1412500139029037057>" },

    { name: "Marrom | Brown", hex: "#A52A2A", emoji: "<:color_brown:1412500184310616094>" },
  ];

  const embed = new EmbedBuilder()
    .setTitle("Selecione Cor | Select Color")
    .setColor(Colors.White)
    .setDescription(
      [
        `Selecione uma cor abaixo.`,
        `-# ↪ Você também pode usar uma cor personalizada (código hexadecimal).`,
        ``,
        `Select a color below.`,
        `-# ↪ You can also use a custom color (hex code).`,
      ].join("\n")
    );
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`role_color`)
      .setOptions(
        colors.map((c) =>
          new StringSelectMenuOptionBuilder()
            .setValue(c.hex)
            .setDescription(`Cor: ${c.name}`)
            .setLabel(c.name)
            .setEmoji(c.emoji)
        )
      )
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setCustomId("role_color-button")
      .setLabel("Codigo | Code")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:code:1409964623809089576>")
  );

  return { embed, row, row2 };
}
