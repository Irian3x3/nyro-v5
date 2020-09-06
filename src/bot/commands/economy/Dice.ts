import { Message, MessageEmbed } from "discord.js";
import { Command, Argument } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("dice", {
  aliases: ["dice", "rolladie"],
  description: {
    content: "You have a 1/6 chance, why not give it a go?",
    usage: "[number 1-6] [amount]",
    examples: ["4 500"],
  },
  args: [
    {
      id: "number",
      type: Argument.range("number", 1, 6),
      prompt: {
        start: "What number do you think it'll land on?",
        retry: "I'll need a number 1-6.",
      },
    },

    {
      id: "bet",
      type: Argument.range("number", 100, Infinity),
      prompt: {
        start: "How much do you wanna bet on that number?",
        retry: "I'll need a number that's atleast 100",
      },
    },
  ],
  channel: "guild",
})
export default class DiceCommand extends Command {
  public async exec(
    message: Message,
    { number, bet }: { number: number; bet: number }
  ) {
    const data = await message.member.economy();
    if (data.wallet < bet)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`You cannot afford to bet that much.`)
      );

    const random = Math.floor(Math.random() * 6) + 1;
    const die = random === number ? "win" : "loss";

    switch (die) {
      case "win":
        data.wallet += bet;
        await data.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#42f590")
            .setDescription(
              `🎲 You bet correctly! The number was \`${random}\`. You won **${bet}¤**`
            )
        );

      case "loss":
        data.wallet -= bet;
        await data.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `🎲 You guessed incorrectly! The number was \`${random}\`. You lost **${bet}¤**`
            )
        );
    }
  }
}
