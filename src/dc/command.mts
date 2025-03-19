import {Interaction, SlashCommandOptionsOnlyBuilder} from "discord.js";

export interface Command {
    data: SlashCommandOptionsOnlyBuilder
    execute(interaction : Interaction): Promise<void>;
}