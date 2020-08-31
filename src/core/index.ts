export * from "./general";
export * from "./database";

export * from "./NyroClient";

export interface NyroOptions {
  owners: string[];
  outDir: string;
  token: string;
}

import "discord-akairo";
import "discord.js";

import { PrismaClient } from "@prisma/client";
import { Logger } from "@melike2d/logger";
import { Configuration, GuildProvider, ApiHandler } from ".";

declare global {
  const prisma: PrismaClient;
  const config: Configuration;

  interface String {
    capitalise: () => string;
    shorten: (size?: number) => string;
  }
}

declare module "discord-akairo" {
  interface AkairoClient {
    commands: CommandHandler;
    events: ListenerHandler;
    inhibitors: InhibitorHandler;
    logger: Logger;
    settings: GuildProvider;
    opts: NyroOptions;
    version: string;
    apis: ApiHandler;
  }
}

declare module "discord.js" {
  interface GuildMember {
    economy<t>();
  }
}

String.prototype.capitalise = function () {
  return this.replace(/(\b\w)/gi, (str: string) => str.toUpperCase());
};

String.prototype.shorten = function (size = 45) {
  return this.length > size ? `${this.substring(0, size)}..` : this;
};
