import { Structures } from "discord.js";
import { AkairoClient } from "discord-akairo";

export default Structures.extend(
  "User",
  (User) =>
    class extends User {
      public get voted() {
        return (this.client as AkairoClient).apis
          .get("dbl")
          .hasVoted(this.id)
          .then((data) => data);
      }

      public get mutual() {
        return this.client.guilds.cache.find((guild) =>
          guild.members.cache.has(this.id)
        );
      }
    }
);
