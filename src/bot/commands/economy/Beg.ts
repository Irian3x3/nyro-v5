import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("beg", {
  aliases: ["beg"],
  description: { content: "Maybe begging will work?" },
  cooldown: 600000,
})
export default class BegCommand extends Command {
  public async exec(message: Message) {
    const chances = Math.random() > 0.5 ? true : false;

    if (!chances)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Seems that nobody wanted to donate to you.`)
      );

    const data = await message.member.economy();

    const random = Math.floor(Math.random() * 100) + 1;

    data.wallet += random;
    await data.save();

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`A kind stranger donated **${random}¤**`)
    );
  }
}
