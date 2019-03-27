import Command from "../../utils/Command";
import {
    Settings,
    Client,
    Message
} from "../../utils/Interfaces";

export default class Ping extends Command {
    constructor() {
        super("ping", {
            aliases: ["pong"],
            descriptions: "Testing the bot"
        })
    }

    async run(message: Message, args: string[], settings: Settings, client: Client) {
        await message.channel.createMessage("Pong!");
    }
}