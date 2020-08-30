import { Message, MessageEmbed, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand, trimArray } from "#core";
import ms from "ms";

@PublicCommand("whois", {
  aliases: ["whois", "userinfo", "user"],
  description: { content: "View information on a member", usage: "[?member]" },
  args: [
    {
      id: "member",
      type: "member",
      default: (m: Message) => m.member,
    },
  ],
  channel: "guild",
})
export default class WhoisCommand extends Command {
  public exec(message: Message, { member }: { member: GuildMember }) {
    const flags = {
      DISCORD_EMPLOYEE: "<:staff:723770600253816893> Discord Employee",
      DISCORD_PARTNER: "<:partner:723770600107147315> Discord Partner",
      BUGHUNTER_LEVEL_1:
        "<:bug_hunter:723770595925295106> Bug Hunter (Level 1)",
      BUGHUNTER_LEVEL_2:
        "<:bug_hunter:723770595925295106> Bug Hunter (Level 2)",
      HYPESQUAD_EVENTS:
        "<:hypesquad_events:723770600383840266> HypeSquad Events",
      HOUSE_BRAVERY: "<:bravery:723770592020529232> House of Bravery",
      HOUSE_BRILLIANCE: "<:brilliance:723770591869534209> House of Brilliance",
      HOUSE_BALANCE: "<:balance:723770584353341471> House of Balance",
      EARLY_SUPPORTER: "<:early_supporter:723770600459599963> Early Supporter",
      TEAM_USER: "<:staff:723770600253816893> Team User",
      SYSTEM: "<:staff:723770600253816893> System",
      VERIFIED_BOT: "<:verified_developer:723770604548915232> Verified Bot",
      VERIFIED_DEVELOPER:
        "<:verified_developer:723770604548915232> Early Verified Bot Developer",
    };

    const author = {
      online: "<:online:723776606719574086>",
      idle: "<:idle:723776602336526347>",
      dnd: "<:dnd:723776598301736970>",
      offline: "<:offline:723776606711316540>",
    };

    const embed = {
      online: "<:online:723776606719574086> Online",
      idle: "<:idle:723776602336526347> Idle",
      dnd: "<:dnd:723776598301736970> Do Not Disturb",
      offline: "<:offline:723776606711316540> Offline",
    };

    return message.util.send(
      new MessageEmbed()
        .setTitle(
          `${author[member.user.presence.status]} ${member.displayName}`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor(
          member.displayHexColor === "#000000"
            ? "#72767d"
            : member.displayHexColor
        )
        .setDescription(`${member.toString()} (\`${member.id}\`)`)
        .addField(`Discriminator`, member.user.discriminator, true)
        .addField(
          `Created at`,
          `${new Date(member.user.createdAt).toLocaleDateString("en-US")} (${ms(
            Date.now() - member.user.createdTimestamp
          )} ago)`,
          true
        )
        .addField(
          `Joined At`,
          `${new Date(member.joinedAt).toLocaleDateString("en-US")} (${ms(
            Date.now() - member.joinedTimestamp
          )} ago)`,
          true
        )
        .addField(
          `Join Position`,
          message.guild.members.cache
            .sort((a, b) =>
              a.joinedAt < b.joinedAt ? -1 : a.joinedAt > b.joinedAt ? 1 : 0
            )
            .map((m) => m.id)
            .indexOf(member.id) + 1,
          true
        )
        .addField(
          `Devices`,
          member.user.presence.status === "offline"
            ? "Offline, no devices"
            : Object.keys(member.user.presence.clientStatus)
                .map((key) => key.capitalise())
                .join(" › "),
          true
        )
        .addField(
          `Boosting`,
          member.premiumSince
            ? `${new Date(member.premiumSince).toLocaleDateString()} (${ms(
                member.premiumSinceTimestamp
              )} ago)`
            : "Not boosting",
          true
        )
        .addField(
          `Flags`,
          member.user.flags.toArray().length
            ? member.user.flags
                .toArray()
                .map((key) => flags[key])
                .join(" › ")
            : "None"
        )
        .addField(
          `Roles (${member.roles.cache.size - 1})`,
          member.roles.cache.array().slice(0, -1).length
            ? trimArray(
                member.roles.cache
                  .array()
                  .slice(0, -1)
                  .sort((a, b) => b.position - a.position)
              )
                .map((role) => role)
                .join(" › ")
            : "No roles"
        )
    );
  }
}
