import { Message } from "discord.js";
import { Command, Flag } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("data", {
  aliases: ["data"],
  description: {
    content: "Request or delete your data",
    usage: "[request|delete, del, remove, rm]",
    examples: ["request", "delete"],
  },
  channel: "guild",
})
export default class DataCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["data-request", "request"],
        ["data-delete", "delete", "del", "rm", "remove"],
      ],

      otherwise: (msg: Message) => {
        //@ts-ignore
        const prefix = this.handler.prefix(msg);

        return `Invalid usage, run \`${prefix[0]}help data\` to see the usage.`;
      },
    };

    return Flag.continue(method);
  }
}
