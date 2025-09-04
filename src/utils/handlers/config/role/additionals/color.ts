import { AttachmentBuilder, ComponentType, GuildMember, Role, TextChannel } from "discord.js";
import { StringSelectMenuInteraction } from "discord.js";
import colorSelectionPanel from "../../../../panels/colorSelectionPanel";
import { createCanvas } from "canvas";
import * as fs from "fs";
import Embeds from "../../../../../structures/Embeds";

function numberToHexColor(num: number): string {
  // Clamp to 24-bit and pad with leading zeros
  return "#" + (num & 0xffffff).toString(16).padStart(6, "0").toUpperCase();
}

function createColorBuffer(width: number, height: number, color: string | number): Buffer {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Convert number to hex string if needed
  const fillColor = typeof color === "number" ? numberToHexColor(color) : color;

  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, width, height);

  return canvas.toBuffer("image/png");
}
export default async function (interaction: StringSelectMenuInteraction, vipmemberRole: Role) {
  try {
    const { row, row2, embed } = colorSelectionPanel();

    await interaction.reply({
      embeds: [embed],
      components: [row, row2],
    });

    const reply = await interaction.fetchReply();
    const collector = reply.createMessageComponentCollector({
      filter: (c) => c.user.id === interaction.user.id && c.customId.startsWith("role_color"),
      max: 1000,
      time: 10 * 60 * 60 * 1000,
    });
    collector.on("collect", async (int) => {
      if (int.isButton()) {
        await int.reply(["-# <:seta:1412704526879948924> Envie o código hexadecimal abaixo:", "-# <:seta:1412704526879948924> Send the hex code below:"].join("\n"));
        const msgCollector = int.channel.createMessageCollector({
          filter: (m) => m.author.id === int.user.id,
          max: 1,
          time: 60 * 1000,
        });

        msgCollector.on("collect", async (message) => {
          if (message.channel.isSendable()) {
            const hexCode = message.content;
            if (!isValidHex(hexCode)) {
              message.channel.send(
                [
                  `${message.author} Código hexadecimal não valido!`,
                  `-# <:seta:1412704526879948924> Veja este website para pegar codigos hexadecimais: <https://htmlcolorcodes.com>.`,
                  ``,
                  `${message.author} Hex code not valid!`,
                  `-# <:seta:1412704526879948924> Check this website to get some codes: <https://htmlcolorcodes.com>.`,
                ].join("\n")
              );
              msgCollector.stop();
              return;
            }
            await Promise.all([
              vipmemberRole.setColors({
                primaryColor: hexCode as `#${string}`,
              }),
              message.delete(),
            ]);

            const buffer = createColorBuffer(350, 50, vipmemberRole.colors.primaryColor);
            const attachment = new AttachmentBuilder(buffer, { name: "color_preview.png" });
            const reply = await int.fetchReply();

            return reply.edit({
              content: [
                `${message.author} Cor alterada com sucesso!`,
                `-# <:seta:1412704526879948924> Veja a pré-visualização abaixo.`,
                ``,
                `${message.author} Color changed!`,
                `-# <:seta:1412704526879948924> See the preview below.`,
              ].join("\n"),
              files: [attachment],
            });
          }
        });
      }
      if (int.isStringSelectMenu()) {
        const hexCode = int.values[0] as `#${string}`;
        await Promise.all([
          int.reply([`-# <:seta:1412704526879948924> Setando cor...`, `-# <:seta:1412704526879948924> Setting color...`].join("\n")),
          vipmemberRole.setColors({
            primaryColor: hexCode as `#${string}`,
          }),
        ]);

        const buffer = createColorBuffer(350, 50, vipmemberRole.colors.primaryColor);
        const attachment = new AttachmentBuilder(buffer, { name: "color_preview.png" });

        const reply = await int.fetchReply();
        reply.edit({
          content: [
            `${int.user} Cor alterada com sucesso!`,
            `-# <:seta:1412704526879948924> Veja a pré-visualização abaixo.`,
            ``,
            `${int.user} Color changed!`,
            `-# <:seta:1412704526879948924> See the preview below.`,
          ].join("\n"),
          files: [attachment],
        });
      }
    });
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}

function isValidHex(hex: string): boolean {
  return /^(#?[A-Fa-f0-9]{3}|#?[A-Fa-f0-9]{6})$/.test(hex);
}
