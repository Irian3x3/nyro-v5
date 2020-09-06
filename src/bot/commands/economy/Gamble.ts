import { Message, MessageEmbed } from "discord.js";
import { Command, Argument } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("gamble", {
  aliases: ["gamble", "bet"],
  description: {
    content: "Gamble some money",
    usage: "[amount]",
    examples: ["45"],
  },
  args: [
    {
      id: "amount",
      type: Argument.range("number", 100, Infinity),
      prompt: {
        start: "Please provide an amount to bet",
        retry: "I'll need a number that's atleast 100.",
      },
    },
  ],
  channel: "guild",
})
export default class GambleCommand extends Command {
  public async exec(message: Message, { amount }: { amount: number }) {
    const data = await message.member.economy();
    if (data.wallet < amount)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I don't think you can afford to gamble that much.`)
      );

    const chances = Math.random() > 0.3 ? "loss" : "win";

    switch (chances) {
      case "loss":
        data.wallet -= amount;
        await data.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `You lost.. So, that means you've lost **${amount}¤**.`
            )
        );

      case "win":
        data.wallet += amount * 2;
        await data.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#42f590")
            .setDescription(
              `You've won! Which means you've won x2 that amount (**${
                amount * 2
              }¤**)`
            )
        );
    }
  }
}
