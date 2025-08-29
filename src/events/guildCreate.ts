import { Guild } from "discord.js";
import { Bot } from "../structures/Client";
export default {
    name: "guildCreate",
    once: false,
    async execute(client: Bot, guild: Guild) {
        await client.api.guilds.fetch(guild.id);
    }
};