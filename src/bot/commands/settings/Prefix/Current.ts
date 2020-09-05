import { SubCommand } from "#core";
import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";

@SubCommand("prefix-current")
export default class PrefixCommand extends Command {
  public async exec(message: Message) {
    const prefixes: string[] = this.client.settings.get(
      message.guild,
      "core.prefixes"
    );

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription([
          `Here are the prefixes:\n`,
          prefixes
            .map((prefix, index) => `**${index + 1}.** \`${prefix}\``)
            .join(",\n"),
        ])
    );
  }
}
