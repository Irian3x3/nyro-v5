import { MessageEmbed, TextChannel, DMChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("channelDelete", { event: "channelDelete", emitter: "client" })
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
      type: "CHANNEL_DELETE",
    });

    (auditChannel as TextChannel).send(
      new MessageEmbed()
        .setTitle(
          `${this.client.emojis.cache.get(
            "750122317769736262"
          )} Channel Deleted`
        )
        .setColor("#f55e53")
        .setDescription([
          `**Name**: ${channel.name} (\`${channel.id}\`)`,
          `**Type**: ${channel.type.capitalise()} Channel`,
          `**Deleted By**: ${auditlogs.entries
            .first()
            .executor.toString()} (\`${
            auditlogs.entries.first().executor.id
          }\`)`,
        ])
    );
  }
}
