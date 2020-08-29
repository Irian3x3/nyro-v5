import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("ping", {
  aliases: ["ping"],
  description: { content: "Displays the clients ping" },
})
export default class PingCommand extends Command {
  public exec(message: Message) {
    let date = Date.now();

    return new Promise((res) => {
      (this.client["api"] as any).channels[message.channel.id].typing
        .post()
        .then(() => {
          res(
            message.util.send(
              new MessageEmbed()
                .setColor("#42f590")
                .setDescription([
                  `**💓 Heartbeat**: ${this.client.ws.ping}ms`,
                  `**📡 Roundtrip**: ${Date.now() - date}ms`,
                ])
            )
          );
        });
    });
  }
}
