import { GuildMemberRoleManager, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { Bot } from "../../structures/Client";
import generateDashboard from "../../utils/panels/generateDashboard";
import Embeds from "../../structures/Embeds";
import { Guild } from "@duque.edits/sdk";

export default {
  name: "clear",
  alias: ["limpar", "clean"],
  description: "Apagar um numero certo de mensagens.",
  async execute(client: Bot, message: Message, args: string[], guild: Guild) {
    try {
      const isAdmin = message.member.permissions?.has(PermissionFlagsBits.Administrator);
      const allowedRoles = guild.permissions.manage_bot;
      const hasRole = allowedRoles?.some((r) =>
        (message?.member?.roles as GuildMemberRoleManager).cache.some((r2) => r == r2.id)
      );
      const { channel } = message;

      if (!isAdmin && !hasRole) return message.delete();

      const amount = Number(args[0]) ?? 1;

      if (amount > 1000) {
        message.delete().then((c) => {
          (channel as TextChannel).send(
            "<:no_red:1407331795208372388> `|` A quantidade de mensagens deve ser menor que 1000."
          );
        });
      }

      const messages = await channel.messages.fetch({ limit: amount });
      messages.forEach(async (msg) => {
        const fourteenDays = 14 * 24 * 60 * 60 * 1000;
        const isFourteenDaysOrOlder = msg.createdAt.getTime() >= fourteenDays;
        //console.log({ isFourteenDaysOrOlder });
        if (isFourteenDaysOrOlder) await msg.delete();
      });

      (channel as TextChannel).send(
        `<:yes_green:1410952174544093204> \`|\` ${amount} mensagens foram apagadas com sucesso.`
      );
    } catch (error) {
      await message.reply({ embeds: [Embeds.error_occured] });
      return console.error(error);
    }
  },
};
