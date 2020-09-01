import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("guildMemberUpdate", { event: "guildMemberUpdate", emitter: "client" })
export default class GuildMemberUpdate extends Listener {
  public async exec(oldM: GuildMember, newM: GuildMember) {
    const auditLogs: string = this.client.settings.get(
      newM.guild.id,
      "logs.audit"
    );
    const channel = newM.guild.channels.cache.get(auditLogs);

    if (
      !channel ||
      channel.type !== "text" ||
      !channel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    if (oldM.roles.cache.size !== newM.roles.cache.size) {
      const roles = await newM.guild.fetchAuditLogs({
        type: "MEMBER_ROLE_UPDATE",
      });

      const { changes, executor, target } = roles.entries.first();

      (channel as TextChannel).send(
        new MessageEmbed()
          .setColor("#f5f542")
          .setTitle(`✏️ Member Roles Updated`)
          .setDescription([
            `${target.toString()} has had roles ${
              changes[0].key === "$add" ? "added" : "removed"
            }`,
          ])
          .addField(
            `• Moderator`,
            [executor.toString(), `(\`${executor.id}\`)`],
            true
          )
          .addField(
            `• Roles ${changes[0].key === "$add" ? "Added" : "Removed"}`,
            changes[0].new.map((role) => `<@&${role.id}>`).join(", "),
            true
          )
      );
    }

    if (oldM.nickname !== newM.nickname)
      (channel as TextChannel).send(
        new MessageEmbed()
          .setColor("#f5f542")
          .setTitle(`✏️ Member Nickname Updated`)
          .addField(`• Old Nickname`, oldM.nickname ?? oldM.user.username, true)
          .addField(`• New Nickname`, newM.nickname ?? newM.user.username, true)
      );
  }
}
