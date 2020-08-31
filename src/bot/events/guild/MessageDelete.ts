import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("delete", { event: "messageDelete", emitter: "client" })
export default class MessageUpdate extends Listener {
  public exec(message: Message) {
    if (!message.guild || !message.author || message.author.bot) return;

    const audit: string = this.client.settings.get(
      message.guild.id,
      "logs.audit"
    );
    const channel = message.guild.channels.cache.get(audit);

    if (
      !channel ||
      channel.type !== "text" ||
      !channel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setTitle(
          `${this.client.emojis.cache.get("750118319964684358")} Message Delete`
        )
        .setDescription(message.content)
        .addField(
          `• Channel`,
          [message.channel.toString(), `(\`${message.channel.id}\`)`],
          true
        )
        .addField(
          `• Author`,
          [message.author.toString(), `(\`${message.author.id}\`)`],
          true
        )
    );
  }
}
