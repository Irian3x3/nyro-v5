import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "discord-akairo";
import { SubCommand, Moderation } from "#core";

@SubCommand("cases-del", [
  {
    id: "caseId",
    type: "number",
    prompt: {
      start: "Please provide a case to delete",
      retry: "I'll need a number, please",
    },
  },
])
export default class CasesCommand extends Command {
  public async exec(message: Message, { caseId }: { caseId: number }) {
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

    await infraction.delete();

    message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription(`\`Case ${caseId}\` | Deleted case successfully`)
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

    await msg.delete();
  }
}
