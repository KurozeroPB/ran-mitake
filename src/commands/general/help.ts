import Command from "../../utils/Command";
import OokamiClient from "../../utils/OokamiClient";
import { Settings, Message } from "../../utils/Interfaces";
import { upperCaseFirst } from "../../utils/Helpers";

export default class Help extends Command {
    public constructor(category: string) {
        super("help", {
            aliases: [],
            description: "Show help about commands",
            usage: "help [command: string]",
            category: category,
            requiredArgs: 0,
            hidden: false,
            ownerOnly: false,
            guildOnly: false
        });
    }

    public async run(message: Message, args: string[], settings: Settings, client: OokamiClient) {
        if (args.length === 0) {
            let messageQueue: string[] = [];
            let currentMessage = `\n# Here's a list of my commands. For more info do: ${settings.prefix}help <command>\n# Prefix: ${settings.prefix}\n`;
            client.commands.forEach((command) => {
                if (command.options.hidden === true) return; // Command is hidden
                if (command.options.ownerOnly && message.author.id !== settings.owner) return; // Command can only be viewed by the owner

                let toAdd = `@${command.name}\n` +
                    `   "${command.options.description}"\n`;
                if (currentMessage.length + toAdd.length >= 1900) { // If too long push to queue and reset it.
                    messageQueue.push(currentMessage);
                    currentMessage = "";
                }
                currentMessage += `\n${toAdd}`;
            });
            messageQueue.push(currentMessage);
            message.channel.addMessageReaction(message.id, "✅");
            const dm = await client.getDMChannel(message.author.id);
            let sendInOrder = setInterval(async () => {
                if (messageQueue.length > 0) {
                    await dm.createMessage(`\`\`\`py${messageQueue.shift()}\`\`\``); // If still messages queued send the next one.
                } else {
                    clearInterval(sendInOrder);
                }
            }, 300);
        } else {
            const command = this.checkForMatch(args[0], client, settings);
            if (!command) return await message.channel.createMessage(`No command found with the name or alias \`${args[0]}\``);
            if (command.options.hidden === true) return; // Command is hidden
            if (command.options.ownerOnly && message.author.id !== settings.owner)
                return await message.channel.createMessage("This command can only be viewed and used by the owner.");

            
            const helpMessage = "```asciidoc\n" +
                `[${upperCaseFirst(command.name)}]\n\n` +
                `= ${command.options.description} =\n\n` +
                `Aliases            ::  ${command.options.aliases.join(", ")}\n` +
                `Usage              ::  ${settings.prefix}${command.options.usage}\n` +
                `Guild Only         ::  ${command.options.guildOnly ? "yes" : "no"}\n` +
                `Owner Only         ::  ${command.options.ownerOnly ? "yes" : "no"}\n` +
                `Required Args      ::  ${command.options.requiredArgs}\n` +
                // `User Permissions   ::  ${command.userPermissions.join(", ")}\n` +
                // `Bot Permissions    ::  ${command.botPermissions.join(", ")}\n` +
                "\n" +
                "<> = required\n" +
                "[] = optional\n" +
                "```";
            await message.channel.createMessage(helpMessage);
        }
    }

    checkForMatch(name: string, client: OokamiClient, settings: Settings): Command {
        if (name.startsWith(settings.prefix)) {
            name = name.substr(1);
        }

        return client.commands.find((cmd) => cmd.name === name || cmd.options.aliases.indexOf(name) !== -1);
    }
}