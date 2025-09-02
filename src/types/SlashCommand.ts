import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Bot } from "../structures/Client";
import { Guild } from "@duque.edits/sdk";

export interface SlashCommand {
    data: SlashCommandBuilder;
    adminOnly: boolean;
    constructor(): any;
    execute(client: Bot, interaction: ChatInputCommandInteraction, guild?: Guild): Promise<any> | any;
}
