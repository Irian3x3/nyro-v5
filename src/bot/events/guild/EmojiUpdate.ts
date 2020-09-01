import { MessageEmbed, GuildEmoji, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("emojiUpdate", { event: "emojiUpdate", emitter: "client" })
export default class EmojiUpdate extends Listener {
  public async exec(oldE: GuildEmoji, newE: GuildEmoji) {
    const audit: string = this.client.settings.get(oldE.guild.id, "logs.audit");
    const channel = oldE.guild.channels.cache.get(audit);

    if (
      !channel ||
      channel.type !== "text" ||
      !channel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    const auditlogs = await oldE.guild.fetchAuditLogs({
      type: "EMOJI_UPDATE",
    });

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#f5f542")
        .setTitle(
          `${this.client.emojis.cache.get("750147327418957865")} Emoji Updated`
        )
        .setDescription([
          `**Emoji**: <:${oldE.name}:${oldE.id}> (\`${oldE.id}\`)`,
          `**Editor**: ${auditlogs.entries.first().executor.toString()} (\`${
            auditlogs.entries.first().executor.id
          }\`)`,
          `\nChanged name from **${oldE.name}** to **${newE.name}**`,
        ])
    );
  }
}
