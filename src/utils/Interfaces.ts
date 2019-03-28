import OokamiClient from "./OokamiClient";

export { Message, Collection } from "eris";

export interface Settings {
    token: string;
    owner: string;
    prefix: string
};

export interface HandlerOptions {
    settings: Settings;
    client: OokamiClient;
};

export interface CommandOptions {
    aliases: string[];
    descriptions: string;
    category: string;
    ownerOnly?: boolean;
    guildOnly?: boolean;
};
