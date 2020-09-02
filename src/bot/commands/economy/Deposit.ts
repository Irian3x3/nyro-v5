import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("deposit", {
  aliases: ["deposit"],
  description: {
    content: "Puts money into the bank",
    usage: "[amount]",
    examples: ["20"],
  },
  args: [
    {
      id: "amount",
      type: "number",
      prompt: {
        start: "Please provide an amount to deposit",
      },
    },
  ],
  channel: "guild"
})
export default class DepositCommand extends Command {
  public async exec(message: Message, { amount }: { amount: number }) {
    const data = await message.member.economy();

    if (data.wallet < amount || amount <= 0)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I don't think you can put that into the bank`)
      );

    data.wallet -= amount;
    data.bank += amount;
    await data.save();

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(
          `Alright, I've deposited **${amount}¤** into your bank account`
        )
    );
  }
}
