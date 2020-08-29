import { get, set, delete as del } from "dot-prop";
import { Guild as Server } from "discord.js";
import { Guild } from "../models";

interface GuildSettings {
  core: {
    prefixes: string[];
  };
}

const defaults: GuildSettings = {
  core: {
    prefixes: ["nc!"],
  },
};

export class GuildProvider {
  public data = new Map<string, any>();

  public async init() {
    for (const { id, data } of await Guild.all())
      this.data.set(id, JSON.parse(data));
  }

  public get<t>(guild: Server | string, path: string, defaultValue: any): t {
    const item = this.data.get(GuildProvider.id(guild)) ?? defaults;
    return get<t>(item, path) ?? defaultValue;
  }

  public raw(guild: Server | string) {
    return this.data.get(GuildProvider.id(guild)) ?? defaults;
  }

  public async set(guild: Server | string, path: string, value: any) {
    const item =
      this.data.get(GuildProvider.id(guild)) ?? (await this.e(guild));

    set(item, path, value);
    this.data.set(GuildProvider.id(guild), item);

    return await prisma.guild.update({
      where: { id: GuildProvider.id(guild) },
      data: {
        data: JSON.stringify(item),
      },
    });
  }

  public async delete(guild: Server | string, path: string) {
    const item =
      this.data.get(GuildProvider.id(guild)) ?? (await this.e(guild));

    del(item, path);
    this.data.set(GuildProvider.id(guild), item);

    return await prisma.guild.update({
      where: { id: GuildProvider.id(guild) },
      data: {
        data: JSON.stringify(item),
      },
    });
  }

  public async clear(guild: Server | string) {
    const item = this.data.get(GuildProvider.id(guild));
    if (!item) return null;

    this.data.delete(GuildProvider.id(guild));
    return await prisma.guild.delete({
      where: {
        id: GuildProvider.id(guild),
      },
    });
  }

  public async e(guild: Server | string) {
    let item = this.data.get(GuildProvider.id(guild));

    if (!item) {
      const server = new Guild();
      server.id = GuildProvider.id(guild);
      server.data = JSON.stringify(defaults);
      await server.save();

      item = defaults;
    }

    return item;
  }

  public static id(guild: Server | string) {
    if (guild instanceof Server) return guild.id;
    if (guild === "global" || guild === null) return "0";
    if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;

    throw new TypeError(
      'Guild instance is undefined. Valid instances: guildID, "global" or null.'
    );
  }
}
