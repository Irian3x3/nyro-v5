import { Message, GuildMember, MessageEmbed } from "discord.js";
import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("permissions", { event: "missingPermissions", emitter: "commands" })
export default class Permissions extends Listener {
  public exec(message: Message, type: "client" | "user", missing: any[]) {
    switch (type) {
      case "client":
        return message.util.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `I am missing the permission${
                missing.length > 1 ? "s" : ""
              }:\n\n${this.formatPermissions(message.guild.me, missing)}`
            )
        );
      case "user":
        return message.util.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `You are missing the permission${
                missing.length > 1 ? "s" : ""
              }:\n\n${this.formatPermissions(message.member, missing)}`
            )
        );
    }
  }

  public formatPermissions(member: GuildMember, permissions: any[]) {
    const result = member.permissions.missing(permissions).map(
      (str) =>
        `**${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, (char) => char.toUpperCase())}**`
    );

    return result.length > 1
      ? `${result.slice(0, -1).join(", ")} and ${result.slice(-1)[0]}`
      : result[0];
  }
}
