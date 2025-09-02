import { ChannelType, GuildMember, StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../../../structures/Client";
import { Guild, VipMember } from "@duque.edits/sdk";
import Messages from "../../../../structures/Messages";
import Embeds from "../../../../structures/Embeds";

export default async function (
  guildApi: Guild,
  interaction: StringSelectMenuInteraction,
  client: Bot,
  vipMember: VipMember
) {
  try {
    const { roleId } = vipMember;
    const role = interaction.guild.roles.cache.get(roleId);

    if (vipMember.type === "both" && !role) {
      return interaction.reply({ content: Messages.must_create_role_first, flags: 64 });
    }
    const value = interaction.values[0];
    let parentId: string;
    const vipCategories = guildApi.categories.cache.filter((c) => c.type === "vipmembers_category");
    if (vipCategories.size === 0) {
      parentId = (
        await interaction.guild.channels.create({
          name: "/Call VIPS",
          type: ChannelType.GuildCategory,
          position: 2,
        })
      ).id;

      await guildApi.categories.create({ type: "vipmembers_category", ids: [parentId] });
    } else {
      parentId = vipCategories.at(0).ids[0];
    }

    let vipmemberChannel = interaction.guild.channels.cache.get(vipMember.voiceChannelId);
    if (!vipmemberChannel) {
      if (vipMember.type === "channel") {
        vipmemberChannel = await interaction.guild.channels.create({
          name: `waiting-${interaction.user.username}`,
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: ["Connect"],
              allow: ["ViewChannel"],
            },
            {
              id: interaction.user.id,
              allow: ["ViewChannel", "Connect", "ManageChannels"],
            },
          ],
          parent: parentId,
        });
      } else if (role) {
        vipmemberChannel = await interaction.guild.channels.create({
          name: `waiting-${interaction.user.username}`,
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: ["Connect"],
              allow: ["ViewChannel"],
            },
            {
              id: interaction.user.id,
              allow: ["ViewChannel", "Connect", "ManageChannels"],
            },
            {
              id: role?.id,
              allow: ["ViewChannel", "Connect"],
            },
          ],
          parent: parentId,
        });
      }

      await vipMember.update({ voiceChannelId: vipmemberChannel.id });
    }
    if (value === "name") {
      const reply = await interaction.reply({
        content: [
          `Envie o nome do seu canal abaixo.`,
          `-# ↪ Não inclua emojis personalizados.`,
          ``,
          `Send the name for your channel bellow.`,
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
        vipmemberChannel.setName(name, `${msg.author.id} changed it.`);

        Promise.all([
          msg.delete(),
          reply.resource.message.edit(
            [
              `<:yes_green:1410952174544093204> \`|\` Nome do canal alterado com sucesso!`,
              `-# ↪ Para alterá-lo novamente selecione um espaço vazio e selecione 'Nome' novamente.`,
              ``,
              `<:yes_green:1410952174544093204> \`|\` Channel's name was changed!`,
              `-# ↪ To change it again, select an open space then select option 'Name' again.`,
            ].join("\n")
          ),
        ]);
      });
    }
  } catch (error) {
    if (interaction.deferred || interaction.replied) interaction.editReply({ embeds: [Embeds.error_occured] });
    else interaction.reply({ embeds: [Embeds.error_occured], flags: 64 });
    return console.error(error);
  }
}
