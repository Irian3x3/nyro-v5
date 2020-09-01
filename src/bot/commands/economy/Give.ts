import { Message, MessageEmbed, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand, confirm } from "#core";

@PublicCommand("give", {
  aliases: ["give"],
  description: {
    content: "Give your money to a selected user",
    usage: "[member] [amount]",
    examples: ["@aesthetical 100"],
  },
  channel: "guild",
  args: [
    {
      id: "member",
      type: "member",
      prompt: {
        start: "Please provide a member",
        retry: "Uh, I don't think that's a real member. Try again?",
      },
    },

    {
      id: "amount",
      type: "number",
      prompt: {
        start: "Please provide an amount to give to someone",
        retry: "I need a number, please try again.",
      },
    },
  ],
})
export default class GiveCommand extends Command {
  public async exec(
    message: Message,
    { member, amount }: { member: GuildMember; amount: number }
  ) {
    const donator = await message.member.economy();
    if (donator.wallet < amount)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I don't think you can afford to give that much.`)
      );

    const person = await member.economy();

    const conf = await confirm(
      message,
      `Are you sure you'd like to give **${amount}¤** to ${member}? This action is unreversable.`
    );

    if (!conf)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Okay, then I've cancelled the transaction.`)
      );

    person.wallet += amount;
    donator.wallet -= amount;

    await person.save();
    await donator.save();

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`Okay, you have given ${member} **${amount}¤**`)
    );
  }
}
