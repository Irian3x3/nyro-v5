import { SubCommand, Tags } from "#core";
import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";

@SubCommand("tag-edit", [
  {
    id: "tag",
    type: "tag",
    prompt: {
      start: "Please provide a tag name to edit",
      retry: "That's an invalid tag name. Try again?",
    },
  },

  {
    id: "content",
    match: "rest",
    prompt: {
      start: "Please provide a new content",
    },
  },
])
export default class TagCommand extends Command {
  public async exec(
    message: Message,
    { tag, content }: { tag: Tags; content: string }
  ) {
    if (
      tag.author !== message.author.id &&
      !message.member.permissions.has("MANAGE_GUILD", true)
    )
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`You cannot edit someone elses tag!`)
      );

    tag.content = content;

    await prisma.tags.update({
      where: {
        guild_name: {
          guild: tag.guild,
          name: tag.name,
        },
      },
      data: tag,
    });

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`I have now edited that tag!`)
    );
  }
}
