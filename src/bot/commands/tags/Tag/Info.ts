import { SubCommand, Tags } from "#core";
import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";

@SubCommand("tag-info", [
  {
    id: "tag",
    type: "tag",
    prompt: {
      start: "Please provide a tag to view information on",
      retry: "I would need a valid tag to see information on..",
    },
  },
])
export default class TagCommand extends Command {
  public exec(message: Message, { tag }: { tag: Tags }) {
    return message.util.send(
      new MessageEmbed()
        .setAuthor(
          tag.name.substring(0, 100),
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setColor("#42f590")
        .setDescription(tag.content ?? "No tag content")
        .addField(`Name`, tag.name, true)
        .addField(`Creator`, [`<@!${tag.author}>`, `(\`${tag.author}\`)`], true)
        .addField(
          `Editor`,
          [`<@!${tag.editedby}>`, `(\`${tag.editedby}\`)`],
          true
        )
        .addField(`Uses`, tag.uses, true)
        .addField(`Created At`, new Date(tag.createdat).toLocaleString(), true)
        .addField(`Edited At`, new Date(tag.editedat).toLocaleString(), true)
    );
  }
}
