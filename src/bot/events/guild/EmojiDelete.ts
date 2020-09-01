import { MessageEmbed, GuildEmoji, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("emojiDelete", { event: "emojiDelete", emitter: "client" })
export default class EmojiDelete extends Listener {
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
      type: "EMOJI_DELETE",
    });

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setTitle(
          `${this.client.emojis.cache.get("750147327259443283")} Emoji Delete`
        )
        .setDescription([
          `**Emoji**: ${emoji.toString()} (\`${emoji.id}\`)`,
          `**Deleter**: ${auditlogs.entries.first().executor.toString()} (\`${
            auditlogs.entries.first().executor.id
          }\`)`,
        ])
    );
  }
}
