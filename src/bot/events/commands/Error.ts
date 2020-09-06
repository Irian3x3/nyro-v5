import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("commandError", { event: "error", emitter: "commands" })
export default class cError extends Listener {
  public async exec(error: Error, message: Message) {
    this.client.logger.error(error.message);

    error.message
      .split(" ")
      .map((key) =>
        Object.values({
          token: this.client.token,
          ...config.get("apis"),
        }).map(
          (val: string) =>
            (error.message = error.message.replace(val, "[redacted]"))
        )
      )
      .join(" ");

    message.channel.send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setDescription([
          `Oh no! This isn't supposed to be happening... Join the [support server](${config.get(
            "invites.guild"
          )}) for assistance.`,
          `\`\`\`js\n${error.message}\`\`\``,
        ])
    );

    const channel = this.client.channels.cache.get("715293277502570546");
    if (!channel || channel.type !== "text") return;

    const webhook = await (channel as TextChannel).createWebhook(
      `${this.client.user.username} Errors`,
      { avatar: this.client.user.displayAvatarURL() }
    );

    await webhook.send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setDescription([
          `New error in ${message.guild.name.shorten(45)} (\`${
            message.guild.id
          }\`):`,
          `\`\`\`js\n${error.message}\`\`\``,
        ])
        .setFooter(`Errors`)
        .setTimestamp(Date.now())
    );

    await webhook.delete();
  }
}
