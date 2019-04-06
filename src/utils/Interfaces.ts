import RanClient from "./RanClient";
import { Guild, VoiceChannel, VoiceConnection, ClientOptions, TextChannel } from "eris";

export { Guild, Message, Collection, VoiceState, VoiceChannel,TextChannel } from "eris";

export interface Settings {
    token: string;
    owner: string;
    prefix: string;
    googleKey: string;
};

export interface RanOptions {
    settings: Settings;
    token: string;
    erisOptions?: ClientOptions;
}

export interface HandlerOptions {
    settings: Settings;
    client: RanClient;
};

export interface CommandOptions {
    aliases: string[];
    description: string;
    usage: string;
    category: string;
    requiredArgs: number;
    hidden: boolean;
    ownerOnly: boolean;
    guildOnly: boolean;
};

export interface Song {
    id: string;
    title: string;
    url: string;
}

export interface Queue {
    id: string;
    channel: TextChannel;
    songs: Song[];
    loop: boolean;
    volume: number;
    connection: VoiceConnection|null
}

export interface PlayerOptions {
    client: RanClient;
    guild: Guild;
    songQueue: Queue;
}