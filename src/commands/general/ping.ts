import Command from "../../utils/Command";
import { Message } from "../../utils/Interfaces";

export default class Ping extends Command {
    constructor(category: string) {
        super("ping", {
            aliases: ["pong"],
            descriptions: "Testing the bot",
            category: category
        })
    }

    async run(message: Message) {
        await message.channel.createMessage("Pong!");
    }
}