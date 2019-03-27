import {
    Settings,
    CommandOptions,
    Message,
    Client
} from "./Interfaces";

export default class Command {
    id: string;
    name: string;
    options: CommandOptions;

    public constructor(name: string, options: CommandOptions) {
        this.id = name;
        this.name = name;
        this.options = options;
    }

    // @ts-ignore
    public async run(message: Message, args: string[], settings: Settings, client: Client) {
        console.log("This should never log!");
    }
}
