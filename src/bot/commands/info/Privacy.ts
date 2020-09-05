import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

@PublicCommand("privacy", {
  aliases: ["privacy"],
  description: {
    content: `Shows the user the privacy policy.`,
  },
  clientPermissions: ["EMBED_LINKS"],
})
export default class PrivacyCommand extends Command {
  public async exec(message: Message) {
    return message.util.send([
      `We are required to give you a privacy policy regarding data collection.`,
      `Refer here for the privacy policy: https://github.com/Sxmurai/nyro-v5/blob/master/PRIVACY.md`,
    ]);
  }
}
