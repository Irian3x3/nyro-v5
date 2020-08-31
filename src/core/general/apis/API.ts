import { ApiHandler } from "./APIHandler";

interface APIOptions {
  name?: string;
  baseUrl?: string;
}

export class API {
  public options: APIOptions;

  public constructor(options: APIOptions) {
    //@ts-ignore
    options.name = options.name ?? this.constructor.class;
    options.baseUrl = options.baseUrl ?? "";

    this.options = options;
  }

  private static get class() {
    return this.name.toLowerCase();
  }
}
