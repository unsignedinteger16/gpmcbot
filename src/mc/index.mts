import * as mineflayer from 'mineflayer';
import * as mf_viewer from 'prismarine-viewer';

import * as config from '../../config.json' with { type: "json" };
import {dcClient} from "../dc/index.mjs";
import {TextChannel} from "discord.js";

import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';


export let bot: mineflayer.Bot;

export function InitMc() {
    bot = mineflayer.createBot({
        host: config.default.ip,
        username: config.default.username,
        port: config.default.port,
        version: "1.18.2",
    });

    bot.loadPlugin(pathfinder);

    if(!bot) throw new Error("Bot is missing");

    bot.once("spawn", () => {
        const defaultMove = new Movements(bot)
        bot.pathfinder.setMovements(defaultMove)

        mf_viewer.mineflayer(bot, {
            port: 3007,
            firstPerson: false,
        })

        if(config.default.isTestingServer) {

            bot.chat("/login " + config.default.mcPass)

            bot.setQuickBarSlot(0)
            bot.activateItem();
        }

    })

    bot.once('chat', async (un, msg) => {
        if(un == bot.username) return;
        const channel = dcClient?.channels.cache.get(config.default.chatChannelId);
        let channel2 = (await channel?.fetch())
        if(channel2 instanceof TextChannel) {
            await channel2.send("<" + un + "> " + msg);
        }
    })
}