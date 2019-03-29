import Command from "../../utils/Command";
import { Message } from "../../utils/Interfaces";

export default class Ping extends Command {
    constructor(category: string) {
        super("ping", {
            aliases: ["pong"],
            description: "Testing the bot",
            usage: "ping",
            category: category,
            requiredArgs: 0,
            hidden: false,
            ownerOnly: false,
            guildOnly: false
        })
    }

    async run(message: Message) {
        await message.channel.createMessage("Pong!");
    }
}