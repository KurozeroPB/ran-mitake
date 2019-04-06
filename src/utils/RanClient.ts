import { Client, Collection } from "eris";
// @ts-ignore
import YouTube from "simple-youtube-api";
import Command from "./Command";
import Logger from "./Logger";
import MusicPlayer from "./MusicPlayer";
import { RanOptions } from "./Interfaces";

export default class RanClient extends Client {
    public commands: Collection<Command> = new Collection(Command);
    public players: Collection<MusicPlayer> = new Collection(MusicPlayer);
    public youtube: any;
    public logger: Logger;

    public constructor(options: RanOptions) {
        super(options.token, options.erisOptions);

        this.youtube = new YouTube(options.settings.googleKey);
        this.logger = new Logger();
    }
}