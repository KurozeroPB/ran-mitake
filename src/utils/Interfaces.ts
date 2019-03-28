import { Client } from "eris";

export { Client, Message, Collection } from "eris";

export interface Settings {
    token: string;
    owner: string;
    prefix: string
};

export interface HandlerOptions {
    settings: Settings;
    client: Client;
};

export interface CommandOptions {
    aliases: string[];
    descriptions: string;
    category: string;
    ownerOnly?: boolean;
    guildOnly?: boolean;
};
