import { API, Api, querystring } from "#core";
import fetch from "node-fetch";

@Api({ name: "soundcloud", baseUrl: "https://api-v2.soundcloud.com" })
export default class SoundCloud extends API {
  public track(q: string) {
    return this.request(
      `search/tracks?${querystring({ q: encodeURIComponent(q) })}`
    );
  }

  private request(endpoint: string) {
    return fetch(
      //@ts-ignore
      `${this.options.baseUrl}/${endpoint}&client_id=${config.get(
        "apis.soundcloud"
      )}`
    ).then((res) => res.json());
  }
}
