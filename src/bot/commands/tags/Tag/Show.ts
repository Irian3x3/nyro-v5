import { SubCommand, Tags } from "#core";
import { Message, Util } from "discord.js";
import { Command } from "discord-akairo";

@SubCommand("tag-show", [
  {
    id: "name",
    match: "content",
    type: "text",
  },
])
export default class TagCommand extends Command {
  public async exec(message: Message, { name }: { name: string }) {
    const tag = await Tags.find({ guild: message.guild.id, name });
    if (!tag) return;

    tag.uses += 1;

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
      Util.cleanContent(tag.content || "No tag content.", message).substring(
        0,
        1980
      )
    );
  }
}
