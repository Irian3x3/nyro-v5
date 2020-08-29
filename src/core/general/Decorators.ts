import {
  Command,
  CommandOptions,
  Listener,
  ListenerOptions,
  ArgumentOptions,
  ArgumentGenerator,
} from "discord-akairo";

export const PublicCommand = (id: string, options: CommandOptions) => {
  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

export const OwnerCommand = (id: string, options: CommandOptions) => {
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

export const Event = (id: string, options: ListenerOptions) => {
  return <T extends new (...args: any[]) => Listener>(target: T): T => {
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

export const InitModel = (name: string) => {
  return function (constructor: Function) {
    //@ts-ignore
    constructor.tagName = name;
    constructor.prototype.modelName = name;
  };
};
