import { Message, MessageEmbed, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { SubCommand, Moderation, paginate } from "#core";
import ms from "ms";

@SubCommand("cases-all", [
  {
    id: "member",
    type: "member",
    unordered: true,
    default: undefined,
  },

  {
    id: "page",
    type: "number",
    unordered: true,
    default: 0,
  },
])
export default class CasesCommand extends Command {
  public async exec(
    message: Message,
    { member, page }: { member: GuildMember; page: number }
  ) {
    let infractions = (await Moderation.all()).filter(
      (data) => data.guild === message.guild.id
    );
    if (member)
      infractions = infractions.filter((data) => data.user === member.id);

    if (!infractions || !infractions.length)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Hm, It seems you have no infractions here.`)
      );

    const { max, page: p, items } = paginate(infractions, 3, page);

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setAuthor(
          member
            ? `Infractions for ${member.user.username}`
            : `Guild Infractions`,
          member
            ? member.user.displayAvatarURL({ dynamic: true })
            : message.guild.iconURL({ dynamic: true })
        )
        .setDescription(
          items.map(
            (infraction) =>
              `\`#${infraction.case}\` | ${[
                member
                  ? `${infraction.type.capitalise()}`
                  : `<@!${infraction.user}> (${infraction.type.capitalise()})`,
                `\n**Moderator**: <@!${infraction.moderator}>${
                  infraction.duration !== 0
                    ? `\n**Duration**: ${ms(
                        Date.now() - new Date(infraction.duration).getTime()
                      )}`
                    : ``
                }\n**Reason**: ${infraction.reason.shorten(45)}\n\n`,
              ].join("")}`
          )
        )
        .setFooter(`Page ${p}/${max}`)
    );
  }
}
