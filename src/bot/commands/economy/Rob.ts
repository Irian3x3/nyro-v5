import { Message, MessageEmbed, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("rob", {
  aliases: ["rob", "steal"],
  description: {
    content: "Not really worth it, but hey It may bail you out of a situation",
    usage: "[member]",
  },
  args: [
    {
      id: "member",
      type: "member",
      prompt: {
        start: "Please provide a member",
        retry: "I'll need a valid member",
      },
    },
  ],
  cooldown: 120000,
  channel: "guild",
})
export default class RobCommand extends Command {
  public async exec(message: Message, { member }: { member: GuildMember }) {
    if (member.id === message.member.id || member.user.bot)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            member.user.bot
              ? "Why would you want to rob a bot?"
              : "Why would you want to rob yourself?"
          )
      );

    const target = await member.economy();
    if (target.wallet < 500)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `They don't even have 500¤. You really want to rob them?`
          )
      );

    const robber = await message.member.economy();

    const chances = Math.random() > 0.3 ? "success" : "cuaght";

    switch (chances) {
      case "success":
        const amount = Math.floor(Math.random() * target.wallet) + 1;

        robber.wallet += amount;
        target.wallet -= amount;

        await target.save();
        await robber.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#42f590")
            .setDescription(
              `You successfully got **${amount}¤** out of ${member}`
            )
        );

      case "cuaght":
        robber.wallet -= 900;
        target.wallet += 250;

        await target.save();
        await robber.save();

        return message.util.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `You payed **200¤** in compensation to ${member}, and a **650¤** bail fee.`
            )
        );
    }
  }
}
