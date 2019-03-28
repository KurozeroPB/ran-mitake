import OokamiClient from "./OokamiClient";
import { promises as fs } from "fs";
import { Settings, HandlerOptions, Message } from "./Interfaces";

export default class CommandHandler {
    public settings: Settings;
    public client: OokamiClient;

    /**
     * Command handler constructor
     * 
     * @param {HandlerOptions} options Options for the command handler
     */
    public constructor(options: HandlerOptions) {
        this.settings = options.settings;
        this.client = options.client;
    }

    /**
     * Handle all commands
     * 
     * @param {Message} message The message send by the user
     * @param {boolean} dm Whether the command was used in a dm
     * 
     * @returns {Promise<boolean>} Will be true if successful else false
     */
    public async handleCommand(message: Message, dm: boolean): Promise<boolean> {
        const parts = message.content.split(" ");
        const name = parts[0].slice(this.settings.prefix.length);

        const command = this.client.commands.find((cmd) => cmd.name === name || cmd.options.aliases.indexOf(name) !== -1);
        if (!command) return false; // Command doesn't exist

        const args = parts.splice(1);

        if (command.options.guildOnly && dm) {
            await message.channel.createMessage(`The command \`${command}\` can only be run in a guild.`);
            return false;
        }

        if (command.options.ownerOnly && message.author.id !== this.settings.owner) {
            await message.channel.createMessage("Only the owner can execute this command.");
            return false;
        }

        try {
            await command.run(message, args, this.settings, this.client);
            return true;
        } catch (error) {
            await message.channel.createMessage({
                embed: {
                    color: 0xDC143C,
                    description: error.toString()
                }
            });
            return false;
        }
        
    }

    /**
     * Load all commands
     * 
     * @param {string} commandDir The directory with all the commands
     * 
     * @returns {Promise<void>}
     */
    public async loadCommands(commandDir: string): Promise<void> {
        const dirs = await fs.readdir(commandDir);

        for (const dir of dirs) {
            const files = await fs.readdir(`${commandDir}/${dir}`);

            for (const file of files) {
                if (file.endsWith(".ts")) {
                    await this._add(`${commandDir}/${dir}/${file}`, dir);
                }
            }
        }
    }

    private async _add(commandPath: string, category: string): Promise<void> {
        try {
            const cmd = await import(commandPath);
            const command = new cmd.default(category);

            if (this.client.commands.has(command.name)) {
                console.warn(`A command with the name ${command.name} already exists and has been skipped`);
            } else {
                this.client.commands.add(command);
            }
        } catch (e) {
            console.warn(`${commandPath} - ${e.stack}`);
        }
    }
}