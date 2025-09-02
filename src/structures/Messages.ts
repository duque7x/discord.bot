export const formatText = (...text: string[]) => text.join("\n");

export default {
  no_permissions: formatText(
    "<:no_red:1409964586253291732> Você não tem **permissão** para mexer nesta seleção.",
    "",
    `<:no_red:1409964586253291732> You do not have **permission** to modify this selection.`
  ),

  no_member_mention: [
    `<:no_red:1409964586253291732> \`|\` Você precisa **passar o id ou mencionar** um membro.`,
    ``,
    `<:no_red:1409964586253291732> \`|\` You need to send the **member's id or mention** a member.`,
  ].join("\n"),
  no_channel_mention: [
    `<:no_red:1409964586253291732> \`|\` Você precisa mencionar um **canal**.`,
    ``,
    `<:no_red:1409964586253291732> \`|\` You need to mention a **channel**.`,
  ].join("\n"),
  no_role_mention: [
    `<:no_red:1409964586253291732> \`|\` Você precisa mencionar um **cargo**.`,
    ``,
    `<:no_red:1409964586253291732> \`|\` You need to mention a **role**.`,
  ].join("\n"),
  type_not_allowed_vip: [
    `<:no_red:1409964586253291732> \`|\` Tipo de vip **não aceite**!`,
    "-# ↪ Disponiveis: both (cargo e canal), role (cargo), channel (canal)",
  ].join("\n"),
  error_occurs: `-# ↪ Se ocorrer um erro, entre em contacto a administração do servidor.`,
  en_error_occurs: `-# ↪ If there is an error, please report it to the admins of the server.`,

  must_create_role_first: [
    `Você deve criar **o seu cargo** primeiro antes de criar o seu canal de voz!`,
    `You must create **your role** before creating your voice channel!`,
  ].join("\n"),

  must_create_vip: [
    `-# ↪ Você deve criar **o seu cargo** ou o **seu canal** primeiro antes de exucutar esta ação!`,
    `-# ↪ You must create **your role** or **your channel** before doing this!`,
  ].join("\n"),

  must_be_voice: [
    `-# ↪ O canal selecionado deve ser um canal de voz.`,
    `-# ↪ The selected channel must be a voice channel.`,
  ].join("\n"),
};
