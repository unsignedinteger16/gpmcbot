import {
    Client,
    REST,
    Routes,
    GatewayIntentBits,
    Message,
    ActivityType,
    Collection,
    CommandInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandOptionsOnlyBuilder, SlashCommandBuilder
} from "discord.js";
import { bot } from "../mc/index.mjs"
import * as config from '../../config.json' with { type: "json" };
import { GoToCorrdinateCommand } from "./commands/go-to-corrdinate.mjs"
import {Command} from "./command.mjs";

export let dcClient: Client | undefined;
let commands : Collection<string, Command>
let rest = new REST().setToken(config.default.discordToken);

export async function InitDc() {
    dcClient = new Client({
        intents: [
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    })

    commands = new Collection();
    let gtcCommand = new GoToCorrdinateCommand();
    commands.set(gtcCommand.data.name, gtcCommand);

    dcClient.once("ready", async () => {
        console.log("Client is ready!");

        dcClient?.user?.setPresence({
            activities: [{
                name: 'Doing bot stuff on: ' + config.default.ip,
                type: ActivityType.Custom,
            }],
            status: 'dnd'
        });

        let cmdRest: SlashCommandBuilder[] = []
        commands.forEach((command) => {
            cmdRest.push(command.data as SlashCommandBuilder);
        })

        await rest.put(
            Routes.applicationGuildCommands(
                config.default.appId,
                config.default.serverId,
            ),
            { body: cmdRest }
        );
    })

    dcClient.on("messageCreate", (message: Message) => {
        console.log("TEST! (gid: " + message.guild?.id + " cid: " + message.channelId +")")
        if(message.author.bot) return;

        if(message.guildId == config.default.serverId && message.channelId == config.default.chatChannelId) {
            bot.chat("[" + message.author.username + "] " + message.content);
        }
    })

    dcClient.on('interactionCreate', (interaction) => {
        if(interaction instanceof CommandInteraction) {
            const cmd = commands.get(interaction.commandName);
            if(!cmd) return;
            cmd.execute(interaction)
        }
    })

    await dcClient.login(config.default.discordToken);
}