import { ExpressoMiddleware, provide } from "@expressots/core";
import { NextFunction, Request, Response } from "express";
import Axios from "axios";
import ENV from "env";

export let accessToken: string | null = null;
let tokenExpiryTime: number | null = null;
export let tokenType: string | null = null;

@provide(EnsureAuthenticatedMiddleware)
export class EnsureAuthenticatedMiddleware extends ExpressoMiddleware {
  private isTokenExpired(): boolean {
    if(!tokenExpiryTime) {
      return true;
    }
    return Date.now() > tokenExpiryTime;
  }

  private async fetchAccessToken(): Promise<void> {
    try {
      const response = await Axios.post(
        "https://id.twitch.tv/oauth2/token",
        null,
        {
          params: {
            client_id: ENV.Application.CLIENT_ID,
            client_secret: ENV.Application.CLIENT_SECRET,
            grant_type: ENV.Application.GRANT_TYPE,
          },
        },
      );
      accessToken = response.data.access_token;
      tokenExpiryTime = Date.now() + response.data.expires_in * 1000;
      tokenType = response.data.token_type;
      console.log("Novo token obtido:", accessToken);
    } catch (err) {
      console.error('Erro ao obter o token de acesso:', err);
      throw new Error("Erro na autenticação com Twitch");
    }
  }

  async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Promise<void> {
    try {
      if(!accessToken || this.isTokenExpired()) {
        await this.fetchAccessToken();
      }
      req.headers['Authorization'] = `${tokenType} ${accessToken}`;
      next();
    } catch (err) {
      console.error('Erro durante a autenticação', err);
      res.status(500).send('Erro na autenticação');
    }
  }
}
