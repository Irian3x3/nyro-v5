import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";
import { Event } from "#core";

@Event("executed", { event: "commandFinished", emitter: "commands" })
export default class CommandExecuted extends Listener {
  public exec(message: Message, command: Command, args: any) {
    const arg =
      Object.keys(args).length > 1
        ? Object.keys(args).map((key) => args[key])
        : "none";

    this.client.logger.info(
      `${message.author.tag} (${message.author.id}) executed the command ${command} with arguments ${arg}`
    );
  }
}
