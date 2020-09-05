import {
  Command,
  CommandOptions,
  Listener,
  ListenerOptions,
  ArgumentOptions,
  Inhibitor,
  InhibitorOptions,
} from "discord-akairo";

import { APIOptions, API } from ".";

export const PublicCommand = (id: string, options?: CommandOptions) => {
  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

export const OwnerCommand = (id: string, options?: CommandOptions) => {
  return <T extends new (...args: any[]) => Command>(target: T): T => {
    options.ownerOnly = true;

    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

export const SubCommand = (id: string, arg?: ArgumentOptions[]) => {
  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, {
          category: "flag",
          args: arg,
        });
        void args;
      }
    };
  };
};

export const ModerationCommand = (id: string, options?: CommandOptions) => {
  options.category = options.category ?? "moderation";
  options.channel = options.channel ?? "guild";
  options.cooldown = options.cooldown ?? 8500;
  options.ratelimit = options.ratelimit ?? 2;

  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

export const SettingsCommand = (id: string, options?: CommandOptions) => {
  options.channel = "guild";
  options.category = "settings";

  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

export const Event = (id: string, options?: ListenerOptions) => {
  return <T extends new (...args: any[]) => Listener>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

export const Activator = (id: string, options?: InhibitorOptions) => {
  options.reason = options.reason ?? id;

  return <T extends new (...args: any[]) => Inhibitor>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

interface ColumnOptions {
  primary?: boolean;
  defaults?: any;
  nullable?: boolean;
}

export const Column = (options: ColumnOptions = {}) => {
  options.primary = options.primary ?? false;
  options.nullable = options.nullable ?? true;

  return (target: any, name: any) => {
    target.constructor.columns =
      target.constructor.columns ?? new Map<string, any>();

    target.constructor.columns.set(name, options);
  };
};

export const Api = (options: APIOptions) => {
  return <T extends new (...args: any[]) => API>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(options);
        void args;
      }
    };
  };
};
