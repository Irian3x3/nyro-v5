import { Message, MessageEmbed, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("work", {
  aliases: ["work", "job"],
  description: { content: "Getchu some money" },
  cooldown: 14400000,
  channel: "guild"
})
export default class WorkCommand extends Command {
  public async exec(message: Message) {
    const data = await message.member.economy();
    const amount = (Math.floor(Math.random() * 8) + 1) * 16;

    data.wallet += amount;
    await data.save();

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(
          `You worked ${amount / 16} hours and earned **${amount}¤**`
        )
    );
  }
}
