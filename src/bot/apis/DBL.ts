import { API, Api, querystring } from "#core";
import fetch from "node-fetch";

@Api({ name: "dbl", baseUrl: "https://top.gg/api" })
export default class DBL extends API {
  public async hasVoted(id: string): Promise<boolean> {
    //@ts-ignore
    const { voted } = this.request(
      `/bots/702214772749238392/check?${querystring({ userId: id })}`
    );

    return voted === 0 ? true : false;
  }

  private request(endpoint: string) {
    //@ts-ignore
    return fetch(`${this.options.baseUrl}${endpoint}`, {
      headers: {
        authorization: config.get("apis.dbl"),
      },
    }).then((res) => res.json());
  }
}
