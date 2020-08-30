import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand, trimArray } from "#core";
import ms from "ms";

@PublicCommand("serverinfo", {
  aliases: ["serverinfo", "server", "guild"],
  description: {
    content: "Displays the guilds information",
  },
  channel: "guild",
})
export default class ServerInfoCommand extends Command {
  public exec(message: Message) {
    const regions = {
      brazil: ":flag_br: `Brazil`",
      "eu-central": ":flag_eu: `Central Europe`",
      singapore: ":flag_sg: `Singapore`",
      "us-central": ":flag_us: `U.S. Central`",
      sydney: ":flag_au: `Sydney`",
      "us-east": ":flag_us: `U.S. East`",
      "us-south": ":flag_us: `U.S. South`",
      "us-west": ":flag_us: `U.S. West`",
      "eu-west": ":flag_eu: `Western Europe`",
      "vip-us-east": ":flag_us: `VIP U.S. East`",
      london: ":flag_gb: `London`",
      amsterdam: ":flag_nl: `Amsterdam`",
      hongkong: ":flag_hk: `Hong Kong`",
      russia: ":flag_ru: `Russia`",
      southafrica: ":flag_za: `South Africa`",
      europe: ":flag_eu: `Europe`",
      india: ":flag_in: `India`",
    };

    const presences = {
      online: "<:online:723776606719574086>",
      idle: "<:idle:723776602336526347>",
      dnd: "<:dnd:723776598301736970>",
      offline: "<:offline:723776606711316540>",
    };

    const memberTypes = {
      bot: "<:bot:749714538328490077> Bot",
      human: "👤 Human",
    };

    const channels = this.channels(message);
    const statuses = this.presences(message);
    const members = this.members(message);

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setAuthor(
          `Information for ${message.guild.name.shorten()}`,
          message.guild.iconURL({ dynamic: true })
        )
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addField(
          `Owner`,
          [`<@!${message.guild.ownerID}>`, `(\`${message.guild.ownerID}\`)`],
          true
        )
        .addField(
          `Created At`,
          `${new Date(
            message.guild.createdAt
          ).toLocaleDateString()} \n(${ms(
            Date.now() - message.guild.createdTimestamp,
            { long: true }
          )} ago)`,
          true
        )
        .addField(`Region`, regions[message.guild.region], true)
        .addField(
          `Members`,
          Object.keys(members)
            .map((p) => `${memberTypes[p]} ${members[p]}`)
            .join("\n"),
          true
        )
        .addField(
          `Presences`,
          Object.keys(statuses)
            .map((p) => `${presences[p]} \`${statuses[p]}\``)
            .join("\n"),
          true
        )
        .addField(
          `Channels`,
          Object.keys(channels)
            .map((p) => `${p.capitalise()} ${channels[p]}`)
            .join("\n"),
          true
        )
        .addField(
          `Roles (${message.guild.roles.cache.size - 1})`,
          message.guild.roles.cache.array().slice(0, -1).length
            ? trimArray(
                message.guild.roles.cache
                  .array()
                  .sort((a, b) => b.position - a.position)
              )
                .map((role) => role)
                .join(" › ")
            : "No roles"
        )
    );
  }

  public presences(message: Message) {
    const obj = { online: 0, idle: 0, dnd: 0, offline: 0 };

    for (const [, member] of message.guild.members.cache)
      obj[member.presence.status]++;

    return obj;
  }

  public channels(message: Message) {
    const obj = { text: 0, voice: 0, category: 0, news: 0 };

    for (const [, channel] of message.guild.channels.cache) {
      if (!obj[channel.type]) continue;

      obj[channel.type]++;
    }

    return obj;
  }

  public members(message: Message) {
    const obj = { bot: 0, human: 0 };

    for (const [, member] of message.guild.members.cache) {
      if (member.user.bot) obj["bot"]++;
      else obj["human"]++;
    }

    return obj;
  }
}
