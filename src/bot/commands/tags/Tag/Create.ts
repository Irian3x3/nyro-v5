import { SubCommand, Tags } from "#core";
import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";

const USER_MENTION_REGEX = /<@!?(\d{17,19})>/g;
const CHANNEL_MENTION_REGEX = /<#(\d{17,19})>/g;
const ROLE_MENTION_REGEX = /<&(\d{17,19})>/g;

@SubCommand("tag-create", [
  {
    id: "name",
    type: "existingTag",
    prompt: {
      start: "Please provide a tag name.",
      retry: (_, { failure }: { failure: { value: string } }) =>
        `A tag with the name \`${failure.value}\` already exists. Please try again.`,
    },
  },

  {
    id: "content",
    match: "rest",
    prompt: {
      start: "Please provide a tag content.",
    },
  },
])
export default class TagCommand extends Command {
  public async exec(
    message: Message,
    { name, content }: { name: string; content: string }
  ) {
    if (
      name.match(CHANNEL_MENTION_REGEX) ||
      name.match(USER_MENTION_REGEX) ||
      name.match(ROLE_MENTION_REGEX)
    )
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `Your tag name cannot contain a role, user, or channel mention.`
          )
      );

    if (this.handler.resolver.type("commandAlias")(message, name))
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `That name is restricted, because the bot uses that name as a command.`
          )
      );

    const tag = new Tags();
    tag.guild_name = { guild: message.guild.id, name };
    tag.guild = message.guild.id;
    tag.name = name.toLowerCase();
    tag.content = content;
    tag.author = message.author.id;
    tag.editedby = message.author.id;

    await tag.save();

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`Okay, I've created a new tag with that name.`)
    );
  }
}
