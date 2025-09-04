import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import Messages from "../../structures/Messages";
import { VipMember } from "@duque.edits/sdk";

export default function (vipMember: VipMember, interaction: StringSelectMenuInteraction) {
  const embed = new EmbedBuilder()
    .setTitle("Painel VIP")
    .setDescription(
      [
        `Selecione o que você deseja criar ou alterar abaixo:`,
        Messages.error_occurs,
        ``,
        `Select which one of them you want to create or change below:`,
        Messages.en_error_occurs,
      ].join("\n")
    )
    .setTimestamp()
    .setThumbnail(process.env.ICONURL)
    .setColor(0x00ff00);

  const hasCallAccess = vipMember.type === "both" || vipMember.type === "channel";
  const hasRoleAccess = vipMember.type === "both" || vipMember.type === "role";

  const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("vip_member-create-voice")
      .setLabel("Canal | Channel")
      .setEmoji("<:voice_green:1410963110226952223>")
      .setDisabled(!hasCallAccess),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("vip_member-create-role")
      .setLabel("Cargo | Role")
      .setEmoji("<:people_green:1409964519190696058>")
      .setDisabled(!hasRoleAccess)
  );

  return { embed, row };
}
