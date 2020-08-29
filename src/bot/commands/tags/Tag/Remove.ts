import { SubCommand, Tags } from "#core";
import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";

@SubCommand("tag-remove", [
  {
    id: "tag",
    type: "tag",
    match: "content",
    prompt: {
      start: "Please provide a tag",
      retry: "It seems that is an invalid tag.",
    },
  },
])
export default class TagCommand extends Command {
  public async exec(message: Message, { tag }: { tag: Tags }) {
    if (
      tag.author !== message.author.id &&
      !message.member.permissions.has("MANAGE_GUILD", true)
    )
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`You cannot remove someone elses tag!`)
      );

    await prisma.tags.delete({
      where: {
        guild_name: {
          guild: tag.guild,
          name: tag.name,
        },
      },
    });

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`I have now deleted that tag!`)
    );
  }
}
