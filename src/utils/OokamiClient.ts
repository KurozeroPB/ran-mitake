import { Client, ClientOptions, Collection } from "eris";
import Command from "./Command";

export default class OokamiClient extends Client {
    public commands: Collection<Command> = new Collection(Command);

    public constructor(token: string, options?: ClientOptions) {
        super(token, options);
    }
}