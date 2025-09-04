import { GuildMember, Role } from "discord.js";
import { StringSelectMenuInteraction } from "discord.js";
import Embeds from "../../../../../structures/Embeds";

export default async function (interaction: StringSelectMenuInteraction, vipmemberRole: Role) {
  try {
    if (interaction.guild.premiumTier !== 3) {
      return interaction.reply({
        content: [
          `-# <:seta:1412704526879948924> Servidor não tem o nível de booster necessário.`,
          `-# <:seta:1412704526879948924> Server does not have the minimum boost level.`,
        ].join("\n"),
        flags: 64,
      });
    }
    const reply = await interaction.reply({
      content: [
        `Envie o icone do seu cargo abaixo.`,
        `-# <:seta:1412704526879948924> Envie como imagem!`,
        ``,
        `Send the icon for your role bellow.`,
        `-# <:seta:1412704526879948924> Send as a image!`,
      ].join("\n"),
      withResponse: true,
    });
    const collector = interaction.channel.createMessageCollector({
      filter: (msg) => msg.author.id === interaction.user.id,
      max: 1,
      time: 60 * 1000,
    });

    collector.on("collect", (msg) => {
      if (msg.attachments.size === 0) {
        msg.delete();
        reply.resource.message.edit(
          [`-# <:seta:1412704526879948924> Você deve enviar uma imagem.`, `-# <:seta:1412704526879948924> You must send an attachement.`].join("\n")
        );
        return;
      }
      vipmemberRole.setIcon(msg.attachments.at(0).url, `${msg.author.id} changed it.`);
      const member = interaction.member as GuildMember;
      const hasRole = member.roles.cache.has(vipmemberRole.id);
      if (!hasRole) member.roles.add(vipmemberRole.id);

      Promise.all([
        msg.delete(),
        reply.resource.message.edit(
          [
            `<:yes_green:1410952174544093204> \`|\` Icone alterado com sucesso!`,
            `-# <:seta:1412704526879948924> Para alterá-lo novamente selecione um espaço vazio e selecione 'Icone' novamente.`,
            ``,
            `<:yes_green:1410952174544093204> \`|\` Role's icon was changed!`,
            `-# <:seta:1412704526879948924> To change it again, select an open space then select option 'Icon' again.`,
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
