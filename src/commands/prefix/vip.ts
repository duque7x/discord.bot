import { GuildMemberRoleManager, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { Bot } from "../../structures/Client";

import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import { vipPanel } from "../../utils/panels/vipPanel";

export default {
  name: "vip",
  alias: ["painel_vip"],
  description: "Envia o painel vip.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const { embed, row } = vipPanel(message.guild);
      if (message.channel.isSendable()) {
        await message.delete();
        return message.channel.send({ embeds: [embed], components: [row] });
      }
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};
