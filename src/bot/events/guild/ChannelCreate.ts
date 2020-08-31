import { Message, MessageEmbed, TextChannel, DMChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("channelCreate", { event: "channelCreate", emitter: "client" })
export default class ChannelCreate extends Listener {
  public async exec(channel: TextChannel | DMChannel) {
    if (channel.type === "dm" || !channel.guild) return;

    const audit: string = this.client.settings.get(
      channel.guild.id,
      "logs.audit"
    );
    const auditChannel = channel.guild.channels.cache.get(audit);

    if (
      !auditChannel ||
      auditChannel.type !== "text" ||
      !auditChannel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    const auditlogs = await channel.guild.fetchAuditLogs({
      type: "CHANNEL_CREATE",
    });

    (auditChannel as TextChannel).send(
      new MessageEmbed()
        .setTitle(
          `${this.client.emojis.cache.get(
            "750122317954154617"
          )} Channel Created`
        )
        .setColor("#42f590")
        .setDescription([
          `**Name**: ${channel.toString()} (\`${channel.id}\`)`,
          `**Type**: ${channel.type.capitalise()} Channel`,
          `**Created By**: ${auditlogs.entries
            .first()
            .executor.toString()} (\`${
            auditlogs.entries.first().executor.id
          }\`)`,
        ])
    );
  }
}
