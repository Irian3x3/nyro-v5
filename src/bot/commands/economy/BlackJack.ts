import { Message, MessageEmbed } from "discord.js";
import { Command, Argument } from "discord-akairo";
import { PublicCommand, BlackJack } from "#core";

@PublicCommand("blackjack", {
  aliases: ["blackjack", "bj"],
  description: {
    content: "First player to the value of 21 wins!",
    usage: "[amount]",
    examples: ["120"],
  },
  args: [
    {
      id: "amount",
      type: Argument.range("number", 100, Infinity),
      prompt: {
        start: "Please provide an amount to bet",
        retry: "You'll need to provide atleast 100¤.",
      },
    },
  ],
  channel: "guild"
})
export default class BlackJackCommand extends Command {
  public async exec(message: Message, { amount }: { amount: number }) {
    const data = await message.member.economy();
    if (data.wallet < amount)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`You cannot afford to gamble that much.`)
      );

    const game = new BlackJack();
    game.startGame();

    message.channel.send(
      `Would you like to \`hit\`, \`stay\` or \`end\`?`,
      this.embed(game.players)
    );

    const filter = (m: Message) =>
      m.author.id === message.author.id &&
      ["hit", "stay", "end"].includes(m.content.toLowerCase());

    message.channel
      .createMessageCollector(filter, { time: 10000, max: 20 })
      .on("collect", async (msg: Message) => {
        if (msg.content.toLowerCase() === "end")
          return message.channel.send(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(`You've ended the game.`)
          );

        const val = game.move(msg.content.toLowerCase());

        if (val) {
          const valEmbed = this.embed(game.players);

          switch (val) {
            case "won":
              data.amount += amount;
              await data.save();

              valEmbed
                .setColor("#42f590")
                .setDescription(`You've won **${amount}¤**`);
              break;

            case "bust":
              data.wallet -= amount;
              await data.save();

              valEmbed
                .setColor("#f55e53")
                .setDescription(`Busted! You lost **${amount}¤**`);
              break;

            case "lost":
              data.wallet -= amount;
              await data.save();

              valEmbed
                .setColor("#f55e53")
                .setDescription(`You lost. You lost **${amount}¤**`);
              break;

            case "tie":
              valEmbed
                .setColor("#f5f542")
                .setDescription(`You tied with the dealer! Nobody wins.`);
              break;
          }

          // @ts-ignore
          valEmbed.fields[1].value = [
            game.players[1].cards.map(
              (key) =>
                `[\`${this.format(key.value, key.type)}\`](https://google.com)`
            ),
            `\nValue: \`${game.players[1].value}\``,
          ];
          return message.channel.send(valEmbed);
        }

        message.channel.send(
          `Would you like to \`hit\`, \`stay\` or \`end\`?`,
          this.embed(game.players)
        );
      });
  }

  public format(val: number, type: string) {
    return ["King", "Queen", "Jester", "Ace"].includes(type)
      ? type.substring(0, 1)
      : `${val}${type.substring(0, 1)}`;
  }

  public embed(players: any[]) {
    return new MessageEmbed()
      .addField(
        `Your Cards`,
        [
          players[0].cards
            .map(
              (key) =>
                `[\`${this.format(key.value, key.type)}\`](https://google.com)`
            )
            .join(", "),
          `\nValue: \`${players[0].value}\``,
        ],
        true
      )
      .addField(
        `Dealers Cards`,
        [
          players[1].cards
            .slice(0, -1)
            .map(
              (key) =>
                `[\`${this.format(
                  key.value,
                  key.type
                )}\`](https://google.com/) | [\`?\`](https://google.com)`
            )
            .join(", "),
          `\nValue: \`?\``,
        ],
        true
      );
  }
}
