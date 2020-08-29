import { Message, MessageEmbed } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";
import ms from "ms";

@Event("cooldown", { event: "cooldown", emitter: "commands" })
export default class Cooldown extends Listener {
  public exec(message: Message, _, amount: number) {
    return message.util.send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setDescription(
          `Please wait **${ms(amount, {
            long: true,
          })}** before running that command again`
        )
    );
  }
}
