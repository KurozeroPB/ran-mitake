import Command from "./Command";
import { promises as fs } from "fs";
import {
    Settings,
    HandlerOptions,
    Client,
    Message,
    Collection
} from "./Interfaces";

export default class CommandHandler {
    public settings: Settings;
    public client: Client;
    public commands: Collection<Command>;

    public constructor(options: HandlerOptions) {
        this.settings = options.settings;
        this.client = options.client;
        this.commands = new Collection(Command);
    }

    public async handleCommand(message: Message, dm: boolean) {
        const parts = message.content.split(" ");
        const name = parts[0].slice(this.settings.prefix.length);

        const command = this.commands.find((cmd) => cmd.name === name || cmd.options.aliases.indexOf(name) !== -1);
        if (!command) return false // Command doesn't exist

        const args = parts.splice(1);

        if (command.options.guildOnly && dm) {
            try {
                await message.channel.createMessage(`The command \`${command}\` can only be run in a guild.`);
            } catch (e) {}
            return false;
        }

        if (command.options.ownerOnly && message.author.id !== this.settings.owner) {
            try {
                await message.channel.createMessage("Only the owner can execute this command.");
            } catch (e) {}
            return false;
        }

        try {
            await command.run(message, args, this.settings, this.client);
            return true;
        } catch (error) {
            try {
                await message.channel.createMessage({
                    embed: {
                        color: 0xDC143C,
                        description: error.toString()
                    }
                });
            } catch (e) {}
            return false;
        }
    }

    public async loadCommands(commandDir: string) {
        const dirs = await fs.readdir(commandDir);

        for (const dir of dirs) {
            const files = await fs.readdir(`${commandDir}/${dir}`);

            for (const file of files) {
                if (file.endsWith(".ts")) {
                    await this._add(`${commandDir}/${dir}/${file}`);
                }
            }
        }

        return this.commands;
    }

    private async _add(commandPath: string) {
        try {
            const cmd = await import(commandPath);
            const command = new cmd.default();

            if (this.commands.has(command.name)) {
                console.warn(`A command with the name ${command.name} already exists and has been skipped`);
            } else {
                this.commands.add(command);
            }
        } catch (e) {
            console.warn(`${commandPath} - ${e.stack}`);
        }
    }
}