import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("music", {
  aliases: ["music"],
  description: { content: "Information on music." },
})
export default class MusicCommand extends Command {
  public exec(message: Message) {
    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription([
          `On **${this.client.user.username}**, we are discontinuing music. We've decided it's uneeded.`,
          `\nIf you still want music, check out [Stereo](https://top.gg/bot/725808086933176410)`,
        ])
    );
  }
}
