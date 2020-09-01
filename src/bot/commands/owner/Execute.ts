import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { OwnerCommand } from "#core";
import { execSync } from "child_process";

@OwnerCommand("execute", {
  aliases: ["execute", "exec"],
  description: {
    content: "Executes bash",
    usage: "[command]",
    examples: ["ls"],
  },
  args: [
    {
      id: "command",
      match: "content",
      prompt: {
        start: "Please provide a command to run",
      },
    },
  ],
})
export default class ExecuteCommand extends Command {
  public exec(message: Message, { command }: { command: string }) {
    try {
      const hrstart = process.hrtime();
      const evaluated = execSync(command).toString();
      const hr = process.hrtime(hrstart);

      return message.util.send([
        `⏱️ Took:  ${hr[0] > 0 ? `${hr[0]}s ` : ""}${hr[1] / 1000000}ms`,
        `\`\`\`bash\n${evaluated
          .replace(this.client.token, "bitch you thought")
          .substring(0, 1900)}\`\`\``,
      ]);
    } catch (error) {
      return message.util.send(
        `\`\`\`\n${error.toString().substring(0, 1950)}\`\`\``
      );
    }
  }
}
