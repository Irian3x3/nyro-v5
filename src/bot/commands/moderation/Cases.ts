import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";
import { ModerationCommand } from "#core";

@ModerationCommand("cases", {
  aliases: ["cases", "case", "infraction"],
  description: {
    content: "Manages cases in your guild",
    usage:
      "[reason, edit|del, delete, remove, rm|info, information|all] ...args",
    examples: [
      "reason 2 New reason",
      "delete 2",
      "info 2",
      "all",
      "all @Member",
      "all member 2",
      "all 34287398483303 -type warn, ban",
    ],
  },
  userPermissions: ["MANAGE_GUILD"],
})
export default class CasesCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["cases-reason", "reason", "edit"],
        ["cases-del", "del", "delete", "remove", "rm"],
        ["cases-info", "information", "info"],
        ["cases-all", "all"],
      ],

      otherwise: (msg: Message) => {
        // @ts-ignore
        const prefix = this.handler.prefix(msg);

        return `Invalid usage, run \`${prefix[0]}help cases\` to see the usage`;
      },
    };

    return Flag.continue(method);
  }
}
