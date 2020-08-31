import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("update", { event: "messageUpdate", emitter: "client" })
export default class MessageUpdate extends Listener {
  public exec(oldM: Message, newM: Message) {
    if (
      oldM.content === newM.content ||
      !oldM.guild ||
      !oldM.author ||
      oldM.author.bot
    )
      return;

    const audit: string = this.client.settings.get(newM.guild.id, "logs.audit");
    const channel = newM.guild.channels.cache.get(audit);

    if (
      !channel ||
      channel.type !== "text" ||
      !channel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#f5f542")
        .setTitle(`✏️ Message Updated`)
        .setDescription([
          `**Author**: ${newM.author.toString()} (\`${newM.author.id}\`)`,
          `**Channel**: ${newM.channel.toString()} (\`${newM.channel.id}\`)`,
        ])
        .addField(`• Old Message`, oldM.content.shorten(1020))
        .addField(`• New Message`, newM.content.shorten(1020))
    );
  }
}
