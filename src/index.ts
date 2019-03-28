import { Message } from "eris";
import OokamiClient from "./utils/OokamiClient";
import CommandHandler from "./utils/CommandHandler";
import settings from "../settings";

let ready = false;

const client = new OokamiClient(settings.token);
const commandHandler = new CommandHandler({ settings, client });

client.on("messageCreate", async (message: Message) => {
    if (!ready) return; // Bot is not ready yet
    if (!message.author) return; // System message
    if (message.author.discriminator === "0000") return; // Webhook message

    if (message.content.startsWith(settings.prefix)) {
        try {
            if (message.channel.type === 1 && message.author.id !== client.user.id) {
                await commandHandler.handleCommand(message, true);
            } else if (message.channel.type !== 1) {
                await commandHandler.handleCommand(message, false);
            }
        } catch (error) {
            try {
                await message.channel.createMessage({
                    embed: {
                        color: 0xDC143C,
                        description: error.toString()
                    }
                });
            } catch(e) {
                return; // 99% sure missing the sendMessage or embedLinks permission
            }
        }
    }
});

client.on("ready", async () => {
    if (!ready) {
        await commandHandler.loadCommands(`${__dirname}/commands`);

        console.info(`Logged in as ${client.user.username}`);
        console.info(`Loaded [${client.commands.size}] commands`);

        ready = true;
    }
});

process.on("SIGINT", () => {
    client.disconnect({ reconnect: false });
    process.exit();
});

client.connect().catch(console.error);
