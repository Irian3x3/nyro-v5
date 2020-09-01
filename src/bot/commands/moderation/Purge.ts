import { Message, MessageEmbed, GuildMember, TextChannel } from "discord.js";
import { Command, Argument } from "discord-akairo";
import { ModerationCommand, Moderation } from "#core";

@ModerationCommand("purge", {
  aliases: ["purge", "clear"],
  description: {
    content: "Clears messages",
    usage: "[amount] [?@member &?channel]",
  },
  args: [
    {
      id: "amount",
      type: Argument.range("number", 2, 101),
      unordered: true,
      prompt: {
        start: "Please provide an amount to purge.",
        retry: "I'd like a number. please.",
      },
    },

    {
      id: "channel",
      unordered: true,
      type: "textChannel",
      default: (m: Message) => m.channel,
    },

    {
      id: "member",
      unordered: true,
      type: "member",
    },
  ],
  userPermissions: ["MANAGE_MESSAGES"],
  clientPermissions: ["MANAGE_MESSAGES"],
})
export default class PurgeCommand extends Command {
  public async exec(
    message: Message,
    {
      amount,
      channel,
      member,
    }: { amount: number; channel: TextChannel; member: GuildMember }
  ) {
    let ch = await channel.messages.fetch({ limit: amount });
    if (member) ch = ch.filter((msg) => msg.author.id === member.id);

    if (message.deletable) await message.delete();

    await channel.bulkDelete(ch, true);

    message.util
      .send(
        new MessageEmbed()
          .setColor("#42f590")
          .setDescription(`Purged \`${ch.size}/${amount}\` messages`)
      )
      .then((msg) => msg.delete({ timeout: 5000 }));

    const mod: string = this.client.settings.get(
      message.guild,
      "logs.moderation"
    );
    const logs = message.guild.channels.cache.get(mod);

    if (
      !logs ||
      logs.type !== "text" ||
      !logs.permissionsFor(this.client.user).has("SEND_MESSAGES")
    )
      return;

    (logs as TextChannel).send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setAuthor(
          `Messages Deleted`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription([
          `**Messages Deleted**: ${ch.size} messages out of ${amount}`,
          `**Channel**: ${channel.toString()} (\`${channel.id}\`)`,
          `**Moderator**: ${message.member.toString()} (\`${
            message.member.id
          }\`)`,
          member
            ? `**Member**: ${member.user.toString()} (\`${member.id}\`)`
            : ``,
        ])
    );
  }
}
