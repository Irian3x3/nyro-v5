export * from "./general";
export * from "./database";

export * from "./NyroClient";

export interface NyroOptions {
  owners: string[];
  outDir: string;
  token: string;
}

import "discord-akairo";

import { PrismaClient } from "@prisma/client";
import { Logger } from "@melike2d/logger";
import { Configuration, GuildProvider } from ".";

declare global {
  const prisma: PrismaClient;
  const config: Configuration;

  interface String {
    capitalise: () => string;
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
  }
}

String.prototype.capitalise = function () {
  return this.replace(/(\b\w)/gi, (str: string) => str.toUpperCase());
};
