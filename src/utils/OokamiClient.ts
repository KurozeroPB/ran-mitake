import { Client, ClientOptions, Collection } from "eris";
import Command from "./Command";
import Logger from "./Logger";

export default class OokamiClient extends Client {
    public commands: Collection<Command> = new Collection(Command);
    public logger: Logger;

    public constructor(token: string, options?: ClientOptions) {
        super(token, options);

        this.logger = new Logger();
    }
}