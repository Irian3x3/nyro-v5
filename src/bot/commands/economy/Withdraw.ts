import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("withdraw", {
  aliases: ["withdraw"],
  description: {
    content: "Takes money out of the bank",
    usage: "[amount]",
    examples: ["1000"],
  },
  args: [
    {
      id: "amount",
      type: "number",
      prompt: {
        start: "Please provide an amount to withdraw",
      },
    },
  ],
})
export default class WithdrawCommand extends Command {
  public async exec(message: Message, { amount }: { amount: number }) {
    const data = await message.member.economy();

    if (data.bank < amount || amount <= 0)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Seems that you don't have that much in the bank`)
      );

    data.wallet += amount;
    data.bank -= amount;
    await data.save();

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(
          `Alright, I've withdrawed **${amount}¤** out of your bank account`
        )
    );
  }
}
