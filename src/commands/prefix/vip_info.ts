import { GuildMemberRoleManager, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { Bot } from "../../structures/Client";
import generateDashboard from "../../utils/panels/generateDashboard";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";
import vipInfoEmbed from "../../utils/Embeds/vipInfoEmbed";

export default {
  name: "vip_info",
  alias: ["vipinfo", "vi"],
  description: "Apagar um numero certo de mensagens.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const vipmember = guild.vipMembers.cache.get(message.member.id);
      if (!vipmember) return message.reply({ embeds: [Embeds.no_vip] });

      const embed = vipInfoEmbed(vipmember, message);
      return message.reply({ embeds: [embed] });
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};
