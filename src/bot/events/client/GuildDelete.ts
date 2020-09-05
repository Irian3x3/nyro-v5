import { Listener } from "discord-akairo";
import { Guild, TextChannel, MessageEmbed } from "discord.js";
import { Event } from "#core";

@Event("guildDelete", { event: "guildDelete", emitter: "client" })
export default class GuildDelete extends Listener {
  public exec(guild: Guild) {
    const channel = this.client.channels.cache.get("751874100942864435");
    if (!channel || channel.type !== "text") return;

    this.client.guilds.cache.delete(guild.id);

    (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setDescription([
          `${guild.name.shorten(45)} (\`${guild.id}\`).`,
          `\nWe are now in **${this.client.guilds.cache.size}** guilds`,
        ])
        .setFooter(`Left Guild`)
        .setTimestamp(Date.now())
    );
  }
}
