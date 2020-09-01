import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("help", {
  aliases: ["help", "commands"],
  description: {
    content: "Displays the commands",
    usage: "[?command]",
    examples: ["", "whois"],
  },
  args: [
    {
      id: "command",
      type: "commandAlias",
    },
  ],
})
export default class HelpCommand extends Command {
  public exec(message: Message, { command }: { command: Command }) {
    const embed = new MessageEmbed().setColor("#42f590");

    if (!command) {
      for (const [name, category] of this.client.commands.categories.filter(
        this.categoryFilter(message)
      )) {
        embed.addField(
          `• ${name.capitalise()} (${category.size})`,
          category
            .filter((cmd) => (cmd.aliases ? cmd.aliases.length > 0 : false))
            .map((cmd) => `\`${cmd}\``)
            .join(", ") || "rip"
        );
      }

      return message.util.send(
        embed.setAuthor(
          `Commands available for ${message.author.username}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
      );
    }

    //@ts-ignore
    const prefix = this.handler.prefix(message);

    embed
      .setAuthor(
        `Help for ${command}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription([
        command.description.content ?? `No command description for ${command}.`,
        `\n**Usage**:\n${prefix[0]}${command} ${
          command.description.usage ?? ""
        }`,
      ])
      .setFooter(`[] = Required, [?<arg>] = Optional`);

    if (
      command.description.examples &&
      Array.isArray(command.description.examples) &&
      command.description.examples.length
    )
      embed.addField(
        `• Examples`,
        command.description.examples.map(
          (example) => `\`${prefix[0]}${command} ${example}\``
        ) ?? "None"
      );

    return message.util.send(embed);
  }

  private categoryFilter(message: Message) {
    return (c) =>
      ![
        "flag",
        ...(this.client.ownerID.includes(message.author.id) || !message.guild
          ? []
          : message.member.hasPermission("MANAGE_MESSAGES", {
              checkAdmin: true,
              checkOwner: true,
            })
          ? ["owner", "flag"]
          : ["flag", "owner", "settings", "moderation"]),
      ].includes(c.id);
  }
}
