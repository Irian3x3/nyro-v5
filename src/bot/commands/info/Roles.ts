import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand, paginate } from "#core";

@PublicCommand("roles", {
  aliases: ["roles", "allroles"],
  description: {
    content: "Displays the roles in the guild",
    usage: "[?page]",
    examples: ["", "2"],
  },
  args: [
    {
      id: "id",
      type: "number",
      default: 0,
    },
  ],
  channel: "guild",
})
export default class RolesCommand extends Command {
  public exec(message: Message, { id }: { id: number }) {
    const roles = message.guild.roles.cache
      .array()
      .slice(0, -1)
      .sort((a, b) => b.position - a.position);

    const { max, items, page } = paginate(roles, 15, id);

    return message.util.send([
      `Page ${page}/${max}`,
      `\`\`\`${items
        .map(
          (role) =>
            `${role.name.replace(/[^\x00-\x7F]/g, "")}${" ".repeat(
              Math.floor(Math.max(...items.map((role) => role.name.length))) +
                -role.name.replace(/[^\x00-\x7F]/g, "").length
            )} | Members ${role.members.size}`
        )
        .join("\n")}\`\`\``,
    ]);
  }
}
