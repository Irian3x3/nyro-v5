import { MessageEmbed, TextChannel, DMChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";
import ms from "ms";

@Event("channelUpdate", { event: "channelUpdate", emitter: "client" })
export default class ChannelUpdate extends Listener {
  public async exec(oldC: TextChannel, newC: TextChannel) {
    if (!oldC.guild) return;

    const channel: string = this.client.settings.get(
      oldC.guild.id,
      "logs.audit"
    );
    const auditChannel = oldC.guild.channels.cache.get(channel);

    if (
      !auditChannel ||
      auditChannel.type !== "text" ||
      !auditChannel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    const audit = await oldC.guild.fetchAuditLogs({
      type: "CHANNEL_UPDATE",
    });

    let changes = audit.entries.first().changes;

    if (changes.find((data) => data.key === "type"))
      changes = changes.splice(
        changes.findIndex((data) => data.key === "topic")
      );

    if (!changes.length) return;

    (auditChannel as TextChannel).send(
      new MessageEmbed()
        .setColor("#f5f542")
        .setTitle(
          `${this.client.emojis.cache.get(
            "750135264734609418"
          )} Channel Update${changes.length > 1 ? "s" : ""}`
        )
        .setDescription(
          changes.map(
            (data, index) =>
              `\`${index + 1}\` | Changed channel ${data.key.replace(
                /_/g,
                " "
              )} to ${
                data.key === "topic"
                  ? data.new.shorten(12)
                  : data.key === "rate_limit_per_user"
                  ? ms(data.new * 1000)
                  : data.new.shorten(20)
              }`
          )
        )
        .addField(`• Channel`, [newC.toString(), `(\`${newC.id}\`)`], true)
        .addField(
          `• Moderator`,
          [
            audit.entries.first().executor.toString(),
            `(\`${audit.entries.first().executor.id}\`)`,
          ],
          true
        )
    );
  }
}
