import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand, Slots } from "#core";

@PublicCommand("slots", {
  aliases: ["slots", "slotmachine"],
  description: {
    content: "Give the slot machine a little spin, maybe it might pay off",
    usage: "[amount]",
    examples: ["550"],
  },
  cooldown: 120000,
  channel: "guild",
  args: [
    {
      id: "amount",
      type: "number",
      prompt: {
        start: "Please provide an amount to bet",
      },
    },
  ],
})
export default class SlotsCommand extends Command {
  public async exec(message: Message, { amount }: { amount: number }) {
    const data = await message.member.economy();

    if (data.wallet < amount)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`You cannot afford that transaction`)
      );

    const { type, board } = new Slots().checkWin();

    switch (type) {
      case 0:
        data.wallet += amount;
        await data.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#42f590")
            .setAuthor(
              `You won!`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(board)
            .setFooter(`You won ${amount}¤!`)
        );

      case 1:
        data.wallet -= amount;
        await data.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setAuthor(
              `You lost.`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(board)
            .setFooter(`You lost ${amount}¤.`)
        );

      case 2:
        data.wallet += 10000;
        await data.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#ebd234")
            .setAuthor(
              `JACKPOT!`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(board)
            .setFooter(`You won 10k¤`)
        );
    }
  }
}
