import { MessageEmbed, Invite, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";
import ms from "ms";

@Event("inviteCreate", { event: "inviteCreate", emitter: "client" })
export default class InviteCreate extends Listener {
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
      type: "INVITE_CREATE",
    });

    const inv = auditlogs.entries.first().target as Invite;

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#42f590")
        .setTitle(
          `${this.client.emojis.cache.get("750153906344165417")} Invite Created`
        )
        .setDescription([
          `**Code**: ${inv.code}`,
          `**Channel**: ${inv.channel.toString()} (\`${inv.channel.id}\`)`,
          `**Expires**: ${inv.maxAge === 0 ? "Never" : ms(inv.maxAge * 1000)}`,
          `**Uses**: ${inv.maxUses === 0 ? "Unlimited" : inv.maxUses}`,
          `**Creator**: ${inv.inviter.toString()} (\`${inv.inviter.id}\`)`,
        ])
    );
  }
}
