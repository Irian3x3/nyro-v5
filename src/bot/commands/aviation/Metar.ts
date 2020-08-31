import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "#core";
import fetch from "node-fetch";

@PublicCommand("metar", {
  aliases: ["metar"],
  description: {
    content: "Displays weather conditions of an airport",
    usage: "[airport]",
  },
  args: [
    {
      id: "code",
      match: "content",
      prompt: {
        start:
          "Please provide an [airplane ICAO code](https://en.m.wikipedia.org/wiki/ICAO_airport_code)",
      },
    },
  ],
})
export default class MetarCommand extends Command {
  public async exec(message: Message, { code }: { code: string }) {
    const { results, data: res } = await (
      await fetch(`https://api.checkwx.com/metar/${code}/decoded`, {
        headers: {
          "X-API-Key": config.get("apis.metar"),
        },
      })
    ).json();

    if (!res.length || results === 0)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Seems that's an invalid ICAO code.`)
      );

    const data = res[0];

    return message.util.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setAuthor(
          `METAR for ${data.icao}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription([
          `Flight Category: ${data.flight_category}\n`,
          `💨 Wind: ${data.wind.degrees}° - ${data.wind.speed_mph} MPH (${data.wind.speed_kph} KPH)`,
          `🌡️ Temperature ${data.temperature.fahrenheit}° F (${data.temperature.celsius}° C)`,
          `🗺️ Location: ${
            data.location.coordinates.length
              ? data.location.coordinates.map((c) => c).join(", ")
              : "Unknown"
          }`,
          `💧 Dewpoint: ${data.dewpoint.fahrenheit}° F (${data.dewpoint.celsius}° C)`,
          `☔ Humidity: ${
            data.humidity.percent ? `${data.humidity.percent}%` : "Unknown"
          }`,
          `📈 Barometer: ${data.barometer.hg}HG (${data.barometer.hpa}HPA)`,
          `👁️ Visibility: ${data.visibility.miles}mi (${data.visibility.meters}m)`,
          `☁ Clouds: \n${
            data.clouds.length
              ? data.clouds
                  .map(
                    (cloud, index) =>
                      `\`#${index + 1}\` | ${cloud.text ?? "Unknown"} - ${
                        cloud.feet ?? "Unknown"
                      }ft (${cloud.meters ?? "Unknown"}m)`
                  )
                  .join("\n")
              : "No data"
          }`,
          `\n📋 Raw: \n\`${data.raw_text}\``,
        ])
        .setFooter(
          `Last observed on ${new Date(data.observed).toLocaleString()}`
        )
    );
  }
}
