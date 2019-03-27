import Eris from "eris";
import CommandHandler from "./utils/CommandHandler";
import settings from "../settings";

let ready = false;

const client = new Eris.Client(settings.token);
const commandHandler = new CommandHandler({ settings, client });

client.on("messageCreate", async (message: Eris.Message) => {
    if (!ready) return; // Bot is not ready yet
    if (!message.author) return; // System message
    if (message.author.discriminator === "0000") return; // Webhook message

    if (message.content.startsWith(settings.prefix)) {
        if (message.channel.type === 1 && message.author.id !== client.user.id) {
            await commandHandler.handleCommand(message, true);
        } else if (message.channel.type !== 1) {
            await commandHandler.handleCommand(message, false);
        }
    }
});

client.on("ready", async () => {
    if (!ready) {
        const commands = await commandHandler.loadCommands(`${__dirname}/commands`);

        console.info(`Logged in as ${client.user.username}`);
        console.info(`Loaded [${commands.size}] commands`);

        ready = true;
    }
});

client.connect().catch(console.error);
