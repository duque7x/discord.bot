import dotenv from "dotenv";
dotenv.config();

import { GatewayIntentBits, Partials } from "discord.js";
import { Bot } from "./src/structures/Client";

const client: Bot = new Bot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessagePolls,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel],
});

client.api.init().then((c) => {
  client.login(process.env.DISCORD_TOKEN as string).then(b => {
    client.loadEvents();
    client.loadCommands();
  });
});

if (process.env.DEV == "true") {
  client.api.on("debug", console.debug);
  //client.on("debug", console.debug);
}
