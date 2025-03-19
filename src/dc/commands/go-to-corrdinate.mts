import {
    BaseInteraction, CommandInteraction,
    Interaction, MessageContextMenuCommandInteraction,
    RepliableInteraction,
    SlashCommandBuilder,
    SlashCommandIntegerOption
} from "discord.js";
import { Command } from "../command.mjs"
import {bot} from "../../mc/index.mjs";
import pkg from "mineflayer-pathfinder";
import {dcClient} from "../index.mjs";
const { goals } = pkg;

export class GoToCorrdinateCommand implements Command {
    data = new SlashCommandBuilder()
        .setName('go-to-corrdinate')
        .setDescription('"Moves" bot to some coordinate')
        .addIntegerOption(new SlashCommandIntegerOption().setName('x').setDescription('X Coordinate'))
        .addIntegerOption(new SlashCommandIntegerOption().setName('z').setDescription('Z Coordinate'))

    async execute(interaction : Interaction): Promise<void> {
        if(interaction instanceof CommandInteraction) {
            await interaction.reply("Okay!")

            let numberX = interaction.options.get('x')?.value;
            let numberZ = interaction.options.get('z')?.value;

            if(typeof(numberX) != "number" || typeof(numberZ) != "number") return;

            bot.pathfinder.goto(new goals.GoalNearXZ(numberX, numberZ, 500), async () => {
                await interaction.reply("bot transfered!")
            });
        }
    }
}