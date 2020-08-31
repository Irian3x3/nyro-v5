import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  Flag,
} from "discord-akairo";
import { GuildProvider, NyroOptions, Tags, ApiHandler } from ".";
import { MessageEmbed } from "discord.js";
import { Logger } from "@melike2d/logger";
import { join } from "path";

export class Nyro extends AkairoClient {
  public settings = new GuildProvider();
  public version = `v${
    require(process.cwd() + "/package.json").version
  } Developer Build`;
  public logger = new Logger("bot");

  public apis: ApiHandler = new ApiHandler(
    join(this.opts.outDir, "bot", "apis")
  );

  public constructor(public opts: NyroOptions) {
    super({
      ownerID: opts.owners,
      disableMentions: "everyone",
    });

    this.commands.resolver.addType("existingTag", async (message, text) => {
      if (!message.guild || !text) return Flag.fail(text);

      const tag = await Tags.find({
        guild: message.guild.id,
        name: text.toLowerCase(),
      });

      return tag ? Flag.fail(text) : text;
    });

    this.commands.resolver.addType("tag", async (message, text) => {
      if (!message.guild || !text) return Flag.fail(text);

      const tag = await Tags.find({
        guild: message.guild.id,
        name: text.toLowerCase(),
      });

      return tag || Flag.fail(text);
    });
  }

  public commands: CommandHandler = new CommandHandler(this, {
    directory: join(this.opts.outDir, "bot", "commands"),
    prefix: (m) =>
      m.guild
        ? this.settings.get(
            m.guild,
            "core.prefixes",
            config.get("bot.prefixes")
          )
        : config.get("bot.prefixes"),
    allowMention: true,
    automateCategories: true,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, str) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`${str}\n\nType \`cancel\` to cancel.`),
        modifyRetry: (_, str) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`${str}\n\nType \`cancel\` to cancel.`),
        cancel: new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I've now cancelled the command`),
        timeout: new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `You've taken a bit too long, so I'll be cancelling the command.`
          ),
        ended: new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `You've exceeded the retry threshold, so I've cancelled the command.`
          ),
        time: 30000,
        retries: 3,
      },
      otherwise: "",
    },
    ignoreCooldown: this.ownerID,
    ignorePermissions: this.ownerID,
    defaultCooldown: 6500,
    blockBots: true,
    blockClient: true,
    aliasReplacement: /-/gi,
    commandUtil: true,
    handleEdits: true,
  });

  public events: ListenerHandler = new ListenerHandler(this, {
    directory: join(this.opts.outDir, "bot", "events"),
  });

  public async run() {
    this.commands.useListenerHandler(this.events);
    this.events.setEmitters({
      commands: this.commands,
      events: this.events,
    });

    await this.settings.init();

    this.events.loadAll();
    this.commands.loadAll();
    this.apis.loadAll();

    return this.login(this.opts.token);
  }
}
