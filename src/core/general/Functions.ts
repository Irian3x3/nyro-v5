import { Message, MessageEmbed } from "discord.js";
import { AkairoClient } from "discord-akairo";

export const confirm = async (message: Message, content: string) => {
  return new Promise(async (res, rej) => {
    try {
      const responses = ["yes", "no"];
      const msg = await message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription([content, `\nPlease respond with \`yes\` or \`no\``])
      );

      const filter = (m: Message) => m.author.id === message.author.id;

      msg.channel
        .awaitMessages(filter, { max: 1, errors: ["time"], time: 15e3 })
        .then((collected) => {
          const first = collected.first();

          if (!responses.includes(first.content.toLowerCase()))
            return rej(undefined);

          return res(first.content.toLowerCase() === responses[0]);
        })
        .catch(() => {
          return rej(undefined);
        });
    } catch (error) {
      (message.client as AkairoClient).logger.error(error);
      return rej(error);
    }
  });
};

export const paginate = (arr: any[], itemsPerPage = 10, page = 1) => {
  const max = Math.ceil(arr.length / itemsPerPage);
  if (page > max || page < 1) page = 1;

  return {
    max,
    page,
    items: arr.slice((page - 1) * itemsPerPage, page * itemsPerPage),
  };
};


export const trimArray = (array: any[], size = 15) => {
  if (array.length > size) {
    const length = array.length - size - 1;
    array = array.slice(0, size);
    array.push(`and ${length} more...`);
  }

  return array;
};

