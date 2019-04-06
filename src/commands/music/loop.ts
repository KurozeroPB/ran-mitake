import Command from "../../utils/Command";
import RanClient from "../../utils/RanClient";
import { Message, Settings, TextChannel } from "../../utils/Interfaces";

export default class Loop extends Command {
    public constructor(category: string) {
        super("loop", {
            aliases: ["l"],
            description: "Enable or disable looping",
            usage: "loop",
            category: category,
            requiredArgs: 0,
            hidden: false,
            ownerOnly: false,
            guildOnly: true
        });
    }

    public async run(message: Message, _args: string[], _settings: Settings, client: RanClient) {
        const channel = message.channel as TextChannel;
        const player = client.players.get(channel.guild.id);
        if (player) {
            await player.loop(message);
        }
    }
}