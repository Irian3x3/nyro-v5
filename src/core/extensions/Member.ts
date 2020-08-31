import { Structures } from "discord.js";
import { Economy } from "../database/models";

export default Structures.extend(
  "GuildMember",
  (GuildMember) =>
    class Member extends GuildMember {
      public async economy() {
        const data = await Economy.find({
          user: this.id,
          guild: this.guild.id,
        });

        if (data) return data;

        const econ = new Economy();
        //@ts-ignore
        econ.user_guild = { user: this.id, guild: this.guild.id };
        econ.user = this.id;
        econ.guild = this.guild.id;
        econ.bank = 0;
        econ.wallet = 0;

        await econ.save();

        return econ;
      }
    }
);
