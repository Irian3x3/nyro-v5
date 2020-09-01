import "module-alias/register";

import { Configuration, Nyro } from "./core";
import { PrismaClient } from "@prisma/client";

import "./core/extensions/Member";
import "./core/extensions/User";

(global as any).prisma = new PrismaClient({
  errorFormat: "pretty",
});

(global as any).config = Configuration.getInstance();

const bot = new Nyro({
  owners: config.get("bot.owners"),
  outDir: "build",
  token: config.get("bot.token"),
});

(async () => {
  await prisma
    .$connect()
    .then(() => bot.logger.info(`Connected to PostgreSQL`));

  await bot.run();
})();
