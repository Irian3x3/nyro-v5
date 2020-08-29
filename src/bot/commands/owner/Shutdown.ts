import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { OwnerCommand, confirm } from "#core";

@OwnerCommand("shutdown", {
  aliases: ["shutdown"],
  description: { content: "Turns off the bot." },
})
export default class ShutdownCommand extends Command {
  public async exec(message: Message) {
    const response = await confirm(
      message,
      "Are you absoulutely sure you want to turn off the bot?"
    );

    if (!response)
      return message.util.send(
        new MessageEmbed()
          .setColor("#42f590")
          .setDescription(`Alright, I've cancelled the shutdown.`)
      );

    message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`Okay, I am now going to shutdown in 2 seconds..`)
    );

    this.client.logger.warn(
      `The bot has been shut down by ${message.author.tag} (${message.author.id})`
    );

    setTimeout(() => {
      this.client.destroy();
      process.exit();
    }, 2000);
  }
}
