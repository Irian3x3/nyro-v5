import { Tags, PublicCommand, paginate } from "#core";
import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";

@PublicCommand("tags", {
  aliases: ["tags"],
  description: { content: "Displays all of the guilds tags." },
  channel: "guild",
  args: [
    {
      id: "index",
      type: "number",
      default: 0,
    },
  ],
})
export default class TagsCommand extends Command {
  public async exec(message: Message, { index }: { index: number }) {
    const tags = (await Tags.all()).filter(
      (tags) => tags.guild === message.guild.id
    );
    if (!tags.length)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There are no tags for this guild.`)
      );

    const { max, items, page } = paginate(tags, 20, index);

    return message.util.send(
      new MessageEmbed()
        .setColor("42f590")
        .setAuthor(
          `Tags for ${message.guild.name.substring(0, 45)}`,
          message.guild.iconURL({ dynamic: true })
        )
        .setDescription(items.map((tag) => `\`${tag.name}\``).join(", "))
        .setFooter(page > 1 ? `Page ${page}/${max}` : ``)
    );
  }
}
