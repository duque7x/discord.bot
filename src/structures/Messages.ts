export const formatText = (...text: string[]) => text.join("\n");

export default {
  no_permissions: formatText(
    "<:no_red:1409964586253291732> Você não tem permissão para mexer nesta seleção.",
    "",
    `<:no_red:1409964586253291732> You do not have permission to modify this selection.`,
    "",
    `<:no_red:1409964586253291732> Nu ai permisiunea de a modifica această selecție.`,
    "",
    `<:no_red:1409964586253291732> Vous n'avez pas la permission de modifier cette sélection.`,
    "",
    `<:no_red:1409964586253291732> Non hai il permesso di modificare questa selezione.`
  ),

  no_member_mention: `<:no_red:1409964586253291732> \`|\` Você precisa passar o id ou mencionar um membro.`,
  type_not_allowed_vip: [
    `<:no_red:1409964586253291732> \`|\` Tipo de vip não aceite!`,
    "-# ↪ Disponiveis: both (cargo e canal), role (cargo), channel (canal)",
  ].join("\n"),
};
