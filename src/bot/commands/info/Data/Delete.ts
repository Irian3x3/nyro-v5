import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { SubCommand, Tags, Moderation, Economy, confirm } from "#core";

@SubCommand("data-delete")
export default class DataCommand extends Command {
  public async exec(message: Message) {
    const conf = await confirm(
      message,
      "Are you absoulutly sure you want to delete **all** of your data? (note: infractions are not included)"
    );

    if (!conf)
      return message.util.send(
        new MessageEmbed()
          .setColor("#42f590")
          .setDescription(`Alright, I've cancelled the data deletion.`)
      );

    const guilds = message.author.mutual.filter(
      (key) =>
        key.ownerID === message.author.id &&
        this.client.settings.data.has(key.id)
    );

    const tags = (await Tags.all()).filter(
      (tag) => tag.author === message.author.id
    );

    const economy = (await Economy.all()).filter(
      (tag) => tag.user === message.author.id
    );

    [...economy, ...tags].map(async (model) => await model.delete());

    guilds.map((guild) => this.client.settings.clear(guild));

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`All of your data has been deleted!`)
    );
  }
}
