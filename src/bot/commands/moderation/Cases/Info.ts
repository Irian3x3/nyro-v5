import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { SubCommand, Moderation } from "#core";
import ms from "ms";

@SubCommand("cases-info", [
  {
    id: "caseId",
    type: "number",
    prompt: {
      start: "Please provide a case id",
      retry: "It would be helpful if you actually provided a number/",
    },
  },
])
export default class CasesCommand extends Command {
  public async exec(message: Message, { caseId }: { caseId: number }) {
    let infraction = await Moderation.find({
      guild: message.guild.id,
      case: caseId,
    });

    if (!infraction)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `The case you provided is invalid, or has been deleted.`
          )
      );

    infraction = infraction.json();

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setAuthor(
          `Case #${caseId} (${infraction.type.capitalise()})`,
          (await this.client.users.fetch(infraction.user)).displayAvatarURL({
            dynamic: true,
          })
        )
        .setDescription(infraction.reason)
        .addField(
          `• Moderator`,
          [
            (await this.client.users.fetch(infraction.moderator)).toString(),
            `(\`${infraction.moderator}\`)`,
          ],
          true
        )
        .addField(
          `• Other`,
          [
            `**Date Issued**: ${new Date(
              infraction.date
            ).toLocaleDateString()} (${ms(
              Date.now() - new Date(infraction.date).getTime()
            )} ago)`,
            `**Victim**: ${(
              await this.client.users.fetch(infraction.user)
            ).toString()} (\`${infraction.user}\`)`,
            infraction.duration !== 0
              ? `**Time**: ${new Date(
                  infraction.duration
                ).toLocaleDateString()} (${ms(
                  new Date(Date.now()).getTime() -
                    new Date(infraction.duration).getTime()
                )} left)`
              : ``,
          ],
          true
        )
    );
  }
}
