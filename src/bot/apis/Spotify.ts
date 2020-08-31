import { API, Api, querystring } from "#core";
import fetch from "node-fetch";

@Api({ name: "spotify", baseUrl: "https://api.spotify.com/" })
export default class Spotify extends API {
  #authorization: any;

  public async track(q: string) {
    if (!this.#authorization) this.#authorization = await this.token;
    if (
      new Date(Date.now()).getTime() >=
      new Date(this.#authorization.expiresAt).getTime()
    )
      this.#authorization = await this.token;

    return this.request(
      `v1/search?${querystring({ q: encodeURIComponent(q), type: "track" })}`
    );
  }

  private request(endpoint: string) {
    //@ts-ignore
    return fetch(`${this.options.baseUrl}${endpoint}`, {
      headers: {
        //@ts-ignore
        Authorization: `${this.#authorization.tokenType} ${
          this.#authorization.accessToken
        }`,
        "User-Agent": "Nyro Discord Bot (NodeJS, v3.0.0)",
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  }

  private get token() {
    return fetch(
      `https://accounts.spotify.com/api/token?grant_type=client_credentials`,
      {
        method: "POST",
        headers: {
          authorization: `Basic ${Buffer.from(
            config.get("apis.spotify")
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((r) => r.json())
      .then((data) => {
        const { access_token, expires_in, token_type } = data;

        return {
          accessToken: access_token,
          expiresIn: expires_in,
          tokenType: token_type,
          expiresAt: new Date(
            new Date().getTime() + (expires_in - 2000) * 1000
          ),
        };
      });
  }
}
