import { Message, MessageEmbed } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("blocked", { event: "commandBlocked", emitter: "commands" })
export default class Blocked extends Listener {
  public exec(message: Message, _, reason: string) {
    switch (reason.toLowerCase()) {
      case "owner":
        return message.util.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`That command is owner only.`)
        );

      case "guild":
        return message.util.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`Please run this command in a guild.`)
        );
    }
  }
}
