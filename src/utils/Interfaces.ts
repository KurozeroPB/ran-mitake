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
    description: string;
    usage: string;
    category: string;
    requiredArgs: number;
    hidden: boolean;
    ownerOnly: boolean;
    guildOnly: boolean;
};
