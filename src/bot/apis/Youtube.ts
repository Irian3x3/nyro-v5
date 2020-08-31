import { API, Api, querystring } from "#core";
import fetch from "node-fetch";

@Api({ name: "youtube", baseUrl: "https://www.googleapis.com/youtube/v3/" })
export default class YouTube extends API {
  public search(q: string) {
    return this.request(
      `search?${querystring({
        q: encodeURIComponent(q),
        maxResults: 3,
        part: "snippet",
      })}`
    );
  }

  private request(endpoint: string) {
    return fetch(
      //@ts-ignore
      `${this.options.baseUrl}${endpoint}&key=${config.get("apis.youtube")}`
    ).then((res) => res.json());
  }
}
