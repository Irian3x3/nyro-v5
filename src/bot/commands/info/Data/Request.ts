import { Message, MessageAttachment } from "discord.js";
import { Command } from "discord-akairo";
import { SubCommand, Tags, Moderation, Economy } from "#core";
import { stringify } from "yaml";

@SubCommand("data-request")
export default class DataCommand extends Command {
  public async exec(message: Message) {
    const data = {
      requester: `${message.author.tag} (${message.author.id})`,
      date: new Date(Date.now()).toLocaleString(),
      data: {},
    };

    const guilds = message.author.mutual.filter(
      (key) =>
        key.ownerID === message.author.id &&
        this.client.settings.data.has(key.id)
    );

    const tags = (await Tags.all()).filter(
      (tag) => tag.author === message.author.id
    );

    const infractions = (await Moderation.all()).filter(
      (tag) => tag.user === message.author.id
    );

    const economy = (await Economy.all()).filter(
      (tag) => tag.user === message.author.id
    );

    data.data = {
      tags,
      infractions,
      guilds,
      economy,
    };

    try {
      message.channel.send(
        `Check DMs, I have sent you a .yaml file of your data.`
      );

      message.author.send(
        `Here is your data:`,
        new MessageAttachment(Buffer.from(stringify(data)), "data.yaml")
      );
    } catch {
      message.reply(`please turn on your DMs!`);
    }
  }
}
