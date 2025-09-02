import { GuildMember, Role } from "discord.js";
import { StringSelectMenuInteraction } from "discord.js";
import Embeds from "../../../../../structures/Embeds";

export default async function (interaction: StringSelectMenuInteraction, vipmemberRole: Role) {
  try {
    const reply = await interaction.reply({
      content: [
        `Envie o nome do seu cargo abaixo.`,
        `-# ↪ Não inclua emojis personalizados.`,
        ``,
        `Send the name for your role bellow.`,
        `-# ↪ Don't include custom emojis.`,
      ].join("\n"),
      withResponse: true,
    });
    const collector = interaction.channel.createMessageCollector({
      filter: (msg) => msg.author.id === interaction.user.id,
      max: 1,
      time: 60 * 1000,
    });

    collector.on("collect", (msg) => {
      const name = msg.content;
      vipmemberRole.setName(name, `${msg.author.id} changed it.`);

      const member = interaction.member as GuildMember;
      const hasRole = member.roles.cache.has(vipmemberRole.id);
      if (!hasRole) member.roles.add(vipmemberRole.id);
      Promise.all([
        msg.delete(),
        reply.resource.message.edit(
          [
            `<:yes_green:1410952174544093204> \`|\` Nome alterado com sucesso!`,
            `-# ↪ Para alterá-lo novamente selecione um espaço vazio e selecione 'Nome' novamente.`,
            ``,
            `<:yes_green:1410952174544093204> \`|\` Role's name was changed!`,
            `-# ↪ To change it again, select an open space then select option 'Name' again.`,
          ].join("\n")
        ),
      ]);
    });
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
