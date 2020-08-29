import { Listener } from "discord-akairo";
import { Event } from "#core";

@Event("ready", { event: "ready", emitter: "client" })
export default class Ready extends Listener {
  public exec() {
    this.client.user.setStatus("dnd");
    this.client.user.setActivity(
      `${config.get("bot.prefixes")[0]}help | ${this.client.version}`
    );

    this.client.logger.info(`${this.client.user.username} is ready.`);
  }
}
