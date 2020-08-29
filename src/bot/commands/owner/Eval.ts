import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { OwnerCommand } from "#core";

import { inspect } from "util";

@OwnerCommand("eval", {
  aliases: ["eval"],
  description: { content: "Evals stuff", usage: "[code] <depth>" },
  args: [
    {
      id: "text",
      match: "rest",
      prompt: {
        start: "Please provide something to eval",
      },
    },

    {
      id: "depth",
      type: "number",
      match: "option",
      flag: ["-d ", "-depth "],
      default: 0,
    },
  ],
})
export default class EvalCommand extends Command {
  public async exec(
    message: Message,
    { text, depth }: { text: string; depth: number }
  ) {
    try {
      let toEval = eval(text);

      if (this.isPromise(toEval)) toEval = await toEval;

      const hrstart = process.hrtime();
      const evaluated = inspect(toEval, true, depth);
      const hr = process.hrtime(hrstart);

      return message.util.send([
        `⏱️ Took:  ${hr[0] > 0 ? `${hr[0]}s ` : ""}${hr[1] / 1000000}ms`,
        `🔍 Type: ${this.type(toEval)}`,
        `\`\`\`js\n${evaluated
          .replace(this.client.token, "fuck off")
          .toString()
          .substring(0, 1950)}\`\`\``,
      ]);
    } catch (error) {
      this.client.logger.error(error);
      return message.util.send(
        `\`\`\`js\n${error.toString().substring(0, 1950)}\`\`\``
      );
    }
  }

  public type(value: any) {
    const type = typeof value;
    switch (type) {
      case "object":
        return value === null
          ? "null"
          : value.constructor
          ? value.constructor.name
          : "any";
      case "function":
        return `${value.constructor.name}(${value.length})`;
      case "undefined":
        return "void";
      default:
        return type;
    }
  }

  public isPromise(value: any) {
    return (
      value &&
      typeof value.then === "function" &&
      typeof value.catch === "function"
    );
  }
}
