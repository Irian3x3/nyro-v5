import { SubCommand, Tags } from "#core";
import {
  Message,
  GuildMember,
  MessageEmbed,
  MessageAttachment,
} from "discord.js";
import { Command } from "discord-akairo";

import { stringify } from "yaml";

@SubCommand("tag-download", [
  {
    id: "member",
    type: "member",
    default: (m) => m.member,
  },
])
export default class TagCommand extends Command {
  public async exec(message: Message, { member }: { member: GuildMember }) {
    const data = (await Tags.all()).filter(
      (tag) => tag.guild === message.guild.id && tag.author === member.id
    );
    if (!data.length)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `${
              member.id === message.author.id ? "You" : "They"
            } don't have any tags created.`
          )
      );

    const res = stringify({
      requester: `${message.author.tag} (${message.author.id})`,
      date: new Date().toLocaleDateString(),
      tags: data.map((tag) => tag.json()),
    });

    return message.util.send(
      `As per your request, here is **${member.user.tag}**'s (\`${member.user.id}\`) tag data`,
      new MessageAttachment(Buffer.from(res), `${member.user.username}.yaml`)
    );
  }
}
