import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";
import { Event } from "#core";

@Event("executed", { event: "commandFinished", emitter: "commands" })
export default class CommandExecuted extends Listener {
  public exec(message: Message, command: Command) {
    this.client.logger.info(
      `${message.author.tag} (${message.author.id}) executed the command ${command}`
    );
  }
}
