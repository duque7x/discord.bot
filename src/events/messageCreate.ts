import { Message } from "discord.js";
import { Bot } from "../structures/Client";

const Reset = "\x1b[0m";

const FgGreen = "\x1b[32m";
const event = {
  name: "messageCreate",

  async execute(client: Bot, message: Message) {
    if (message.author.bot) return;
    const guildApi = client.api.guilds.cache.get(message.guildId);
    const prefix = guildApi.prefix || "!";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    const command = client.prefixCommands.find(
      (command) =>
        command.name.toLowerCase() == commandName || command.alias.find((alias) => alias.toLowerCase() === commandName)
    );
    if (!command) return;

    console.log(
      FgGreen +
        `${message.author.tag} - ${
          message.author.id
        } usou o bot as ${new Date().toISOString()}\n Comando: ${commandName}` +
        Reset
    );
    return command.execute(client, message, args, guildApi);
  },
};
export default event;