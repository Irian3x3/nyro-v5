import { SettingsCommand } from "#core";
import { Command, Flag } from "discord-akairo";

@SettingsCommand("prefix", {
  aliases: ["prefix", "prefixes"],
  description: {
    content: "Manage the command prefix",
    usage: "<add|rm, remove, del, delete|current> ...args",
    examples: [
      "",
      "current",
      "add n!!",
      "add 'nik '",
      "delete n!!",
      "delete 'nik '",
    ],
  },
  userPermissions: ["MANAGE_MESSAGES"],
})
export default class PrefixCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["prefix-add", "add"],
        ["prefix-del", "delete", "del", "rm", "remove"],
        ["prefix-current", "current"],
      ],
      default: "prefix-current",
    };

    return Flag.continue(method);
  }
}
