import { PublicCommand } from "#core";
import { Command, Flag } from "discord-akairo";

@PublicCommand("tag", {
  aliases: ["tag", "t"],
  description: {
    content: "Configures tags",
    usage:
      "[?create, add|remove, rm, delete, del|show|download|info, information|edit]",
    examples: [
      "create math 2 + 2 is 4, minus 1 thats 3 quik mafs",
      "remove math",
      "show math",
      "edit math 2 + 2 = fish",
      "download",
      "download @aestheticl",
      "info @aesthetical",
    ],
  },
  channel: "guild",
})
export default class TagCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["tag-create", "create", "add"],
        ["tag-remove", "remove", "rm", "del", "delete"],
        ["tag-show", "show"],
        ["tag-download", "download"],
        ["tag-info", "info", "information"],
        ["tag-edit", "edit"],
      ],
      default: "tags",
    };

    return Flag.continue(method);
  }
}
