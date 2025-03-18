import {Client, GatewayIntentBits, Message, ActivityType} from "discord.js";
import { bot } from "../mc/index.mjs"
import * as config from '../../config.json' with { type: "json" };

export let dcClient: Client | undefined;

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

    dcClient.once("ready", () => {
        console.log("Client is ready!");

        dcClient?.user?.setPresence({
            activities: [{
                name: 'Doing bot stuff on: ' + config.default.ip,
                type: ActivityType.Custom,
            }],
            status: 'dnd'
        });
    })

    dcClient.on("messageCreate", (message: Message) => {
        console.log("TEST! (gid: " + message.guild?.id + " cid: " + message.channelId +")")
        if(message.author.bot) return;

        if(message.guildId == config.default.serverId && message.channelId == config.default.chatChannelId) {
            bot.chat("[" + message.author.username + "] " + message.content);
        }
    })

    await dcClient.login(config.default.discordToken);
}