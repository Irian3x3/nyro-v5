import { MessageEmbed, GuildEmoji, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("emojiCreate", { event: "emojiCreate", emitter: "client" })
export default class EmojiCreate extends Listener {
  public async exec(emoji: GuildEmoji) {
    const audit: string = this.client.settings.get(
      emoji.guild.id,
      "logs.audit"
    );
    const channel = emoji.guild.channels.cache.get(audit);

    if (
      !channel ||
      channel.type !== "text" ||
      !channel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    const auditlogs = await emoji.guild.fetchAuditLogs({
      type: "EMOJI_CREATE",
    });

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#42f590")
        .setTitle(
          `${this.client.emojis.cache.get("750147327502581800")} Emoji Create`
        )
        .setDescription([
          `**Emoji**: ${emoji.toString()} (\`${emoji.id}\`)`,
          `**Creator**: ${auditlogs.entries.first().executor.toString()} (\`${
            auditlogs.entries.first().executor.id
          }\`)`,
        ])
    );
  }
}
