import { Message, MessageAttachment } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";

import { createCanvas } from "canvas";

@PublicCommand("progressbar", {
  aliases: ["progressbar", "progress", "year"],
  description: {
    content: `Displays how long until the year ${
      new Date(Date.now()).getFullYear() === 2020 ? "2020 finally " : ""
    }ends.`,
  },
})
export default class ProgressbarCommand extends Command {
  public async exec(message: Message) {
    const canvas = createCanvas(400, 40);
    const ctx = canvas.getContext("2d");

    const bar = this.bar();

    ctx.fillStyle = "#747f8d";
    ctx.fillRect(5, 5, 390, 30);

    ctx.fillStyle = "#42f590";
    ctx.fillRect(5, 5, Math.floor((390 / 100) * bar), 30);

    return message.util.send(
      `The year **${new Date(Date.now()).getFullYear()}** is **${bar.toFixed(
        2
      )}%** done.`,
      new MessageAttachment(canvas.toBuffer(), "year.png")
    );
  }

  public bar(): number {
    const now = new Date(Date.now()).getTime();

    const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
    const yearEnd = new Date(new Date().getFullYear(), 11, 31).getTime();

    const percentage = 100 * ((now - yearStart) / (yearEnd - yearStart));
    const factor = Math.pow(10, 17);

    const percents = percentage * factor;
    return percents / factor;
  }
}
