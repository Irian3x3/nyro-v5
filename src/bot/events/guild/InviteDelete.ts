import { MessageEmbed, Invite, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";
import ms from "ms";

@Event("inviteDelete", { event: "inviteDelete", emitter: "client" })
export default class InviteDelete extends Listener {
  public async exec(invite: Invite) {
    const audit: string = this.client.settings.get(
      invite.guild.id,
      "logs.audit"
    );
    const channel = invite.guild.channels.cache.get(audit);

    if (
      !channel ||
      channel.type !== "text" ||
      !channel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    const auditlogs = await invite.guild.fetchAuditLogs({
      type: "INVITE_DELETE",
    });

    const inv = auditlogs.entries.first();

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setTitle(
          `${this.client.emojis.cache.get("750153906436309052")} Invite Deleted`
        )
        .setDescription([
          `**Deleter**: ${inv.executor.toString()} (\`${inv.executor.id}\`)`,
          `**Code**: ${invite.code}`,
          `**Channel**: ${invite.channel.toString()} (\`${
            invite.channel.id
          }\`)`,
        ])
    );
  }
}
