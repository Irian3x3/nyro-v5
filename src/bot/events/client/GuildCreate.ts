import { Listener } from "discord-akairo";
import { Guild, TextChannel, MessageEmbed } from "discord.js";
import { Event } from "#core";

@Event("guildCreate", { event: "guildCreate", emitter: "client" })
export default class GuildCreate extends Listener {
  public exec(guild: Guild) {
    const channel = this.client.channels.cache.get("751874100942864435");
    if (!channel || channel.type !== "text") return;

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#42f590")
        .setDescription([
          `${guild.name.shorten(45)} (\`${guild.id}\`).`,
          `\nWe are now in **${this.client.guilds.cache.size}**`,
        ])
        .setFooter(`New Guild`)
        .setTimestamp(Date.now())
    );
  }
}
