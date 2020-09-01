import { Message, MessageEmbed, GuildMember, TextChannel } from "discord.js";
import { Command } from "discord-akairo";
import { ModerationCommand, Moderation } from "#core";

@ModerationCommand("warn", {
  aliases: ["warn"],
  description: {
    content: "Warn a member for being bad",
    usage: "[member] [?reason]",
  },
  args: [
    {
      id: "member",
      type: "member",
      prompt: {
        start: "Please provide a member to warn",
      },
    },

    {
      id: "reason",
      match: "rest",
    },
  ],
  userPermissions: ["MANAGE_MESSAGES"],
})
export default class WarnCommand extends Command {
  public async exec(
    message: Message,
    { member, reason }: { member: GuildMember; reason: string }
  ) {
    if (!member.kickable)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `I cannot warn that member, higher hiarchy in roles. Cannot kick member`
          )
      );

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `You cannot warn this member, as they have a higher rank than you.`
          )
      );

    const caseid: number = this.client.settings.get(
      message.guild,
      "moderation.case",
      1
    );

    if (!reason)
      reason = `Moderators, use \`${
        //@ts-ignore
        this.handler.prefix(message)[0]
      }cases reason ${caseid}\` to add a reason to this case.`;

    const infraction = new Moderation();
    infraction.guild_case = { guild: message.guild.id, case: caseid + 1 };
    infraction.guild = message.guild.id;
    infraction.user = member.user.id;
    infraction.moderator = message.author.id;
    infraction.duration = 0;
    infraction.case = caseid;
    infraction.type = "warn";
    infraction.reason = reason;

    this.client.settings.set(message.guild, "moderation.case", caseid + 1);

    message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`\`Case ${caseid}\` | Warned ${member} successfully.`)
    );

    const mod: string = this.client.settings.get(
      message.guild,
      "logs.moderation"
    );
    const channel = message.guild.channels.cache.get(mod);

    if (
      !channel ||
      channel.type !== "text" ||
      !channel.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    const msg = await (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#f5f542")
        .setAuthor(
          `Case #${caseid} (Warn)`,
          member.user.displayAvatarURL({ dynamic: true })
        )
        .setDescription(reason)
        .addField(
          `Moderator`,
          [message.author.toString(), `(\`${message.author.id}\`)`],
          true
        )
        .addField(`Victim`, [member.toString(), `(\`${member.id}\`)`], true)
    );

    infraction.message = msg.id;
    await infraction.save();
  }
}
