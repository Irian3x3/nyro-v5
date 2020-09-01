import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "discord-akairo";
import { SubCommand, Moderation } from "#core";

@SubCommand("cases-reason", [
  {
    id: "caseId",
    type: "number",
    prompt: {
      start: "Please provide a case ID",
      retry: "Want to give me a case number?",
    },
  },

  {
    id: "reason",
    match: "rest",
    prompt: {
      start: "Please provide a new reason",
    },
  },
])
export default class CasesCommand extends Command {
  public async exec(
    message: Message,
    { caseId, reason }: { caseId: number; reason: string }
  ) {
    const infraction = await Moderation.find({
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

    infraction.reason = reason;
    await infraction.save();

    message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(
          `\`Case ${caseId}\` | Case reason updated successfully.`
        )
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

    const msg = await (channel as TextChannel).messages
      .fetch(infraction.message)
      .catch(() => null);

    if (!msg || !msg.embeds.length) return;

    msg.embeds[0].description = reason;

    return msg.edit(new MessageEmbed(msg.embeds[0]));
  }
}
