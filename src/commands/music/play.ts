import Command from "../../utils/Command";
import RanClient from "../../utils/RanClient";
import MusicPlayer from "src/utils/MusicPlayer";
import { Message, Settings, TextChannel, PlayerOptions } from "../../utils/Interfaces";

export default class Play extends Command {
    public constructor(category: string) {
        super("play", {
            aliases: ["p"],
            description: "Play any youtube song or youtube playlist",
            usage: "play <youtube_url: string>",
            category: category,
            requiredArgs: 1,
            hidden: false,
            ownerOnly: false,
            guildOnly: true
        });
    }

    public async run(message: Message, args: string[], _settings: Settings, client: RanClient) {
        const channel = message.channel as TextChannel;
        const player = client.players.get(channel.guild.id);
        if (!player) {
            const options: PlayerOptions = {
                client,
                guild: channel.guild,
                songQueue: {
                    id: channel.guild.id,
                    channel,
                    songs: [],
                    loop: false,
                    volume: 5,
                    connection: null
                }
            };
            const newPlayer = new MusicPlayer(options);
            client.players.add(newPlayer);
            await newPlayer.play(message, args);
        } else {
            await player.play(message, args);
        }
    }
}