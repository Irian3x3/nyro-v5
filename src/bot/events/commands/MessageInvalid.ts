import { Message } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("invalid", { event: "messageInvalid", emitter: "commands" })
export default class MessageInvalid extends Listener {
  public async exec(message: Message) {
    if (!message.guild && !message.util.parsed.prefix) return;

    if (!message.util.parsed.alias || !message.util.parsed.afterPrefix) return;

    const cmd = this.client.commands.modules.get("tag-show");
    if (!cmd) return;

    return this.client.commands.runCommand(
      message,
      cmd,
      await cmd.parse(message, message.util.parsed.afterPrefix)
    );
  }
}
