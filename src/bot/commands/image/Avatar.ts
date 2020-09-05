import { Message, MessageEmbed, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("avatar", {
  aliases: ["avatar", "av", "pfp"],
  description: {
    content: "View someones profile picture",
    usage: "[?member]",
    examples: ["", "@aesthetical"],
  },
  channel: "guild",
  args: [
    {
      id: "member",
      type: "member",
      default: (m: Message) => m.member,
    },
  ],
})
export default class AvatarCommand extends Command {
  public exec(message: Message, { member }: { member: GuildMember }) {
    return message.util.send(
      new MessageEmbed()
        .setColor(
          member.displayHexColor === "#000000"
            ? "#72767d"
            : member.displayHexColor
        )
        .setAuthor(
          `${
            member.id === message.author.id
              ? "Your"
              : `${member.user.username}'s`
          } profile picture`,
          "",
          member.user.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          ["png", "jpg", "webp"]
            .map(
              (format: any) =>
                `[${format}](${member.user.displayAvatarURL({ format })})`
            )
            .join(" › ")
        )
        .setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
    );
  }
}
