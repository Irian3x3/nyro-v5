import { SubCommand } from "#core";
import { Message, MessageEmbed } from "discord.js";
import { Command, AkairoClient } from "discord-akairo";

@SubCommand("prefix-del", [
  {
    id: "prefix",
    type: (msg: Message, str: string) => {
      if (!str) return null;

      str = str.replace(/`/g, "");

      const prefixes: string[] = (msg.client as AkairoClient).settings.get(
        msg.guild.id,
        "core.prefixes"
      );
      if (!prefixes.includes(str.toLowerCase())) return null;

      return str;
    },
    prompt: {
      start: "Please provide a prefix",
      retry: "That prefix isn't even a prefix, try again?",
    },
  },
])
export default class PrefixCommand extends Command {
  public async exec(message: Message, { prefix }: { prefix: string }) {
    const prefixes: string[] = this.client.settings.get(
      message.guild,
      "core.prefixes"
    );
    prefixes.splice(prefixes.indexOf(prefix));

    this.client.settings.set(message.guild, "core.prefixes", prefixes);

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`Removed the prefix \`${prefix}\``)
    );
  }
}
