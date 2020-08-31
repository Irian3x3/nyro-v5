import { Message, MessageEmbed, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("balance", {
  aliases: ["balance", "bal", "bank", "wallet"],
  description: {
    content: "Displays your or someone elses balance",
    usage: "[?member]",
  },
  args: [
    {
      id: "member",
      type: "member",
      default: (m: Message) => m.member,
    },
  ],
  channel: "guild",
})
export default class BalanceCommand extends Command {
  public async exec(message: Message, { member }: { member: GuildMember }) {
    if (member.user.bot)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Bots cannot have money. That's not until 2049.`)
      );

    const data = await member.economy();

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setAuthor(
          `${member.user.username}'s Balance`,
          member.user.displayAvatarURL({ dynamic: true })
        )
        .setDescription([
          `💳 Wallet: **${data.wallet}¤**`,
          `🏦 Bank: **${data.bank}¤**`,
          `🌐 Net Worh: **${data.wallet + data.bank}¤**`,
        ])
    );
  }
}
