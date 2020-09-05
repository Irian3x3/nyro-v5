import { Inhibitor } from "discord-akairo";
import { Activator } from "#core";
import { Message } from "discord.js";

@Activator("blacklistUser")
export default class uBlacklist extends Inhibitor {
  public exec(message: Message): boolean {
    return this.client.settings
      .get<any[]>("global", "blacklist.users", [])
      .some((key) => key.id === message.author.id);
  }
}
