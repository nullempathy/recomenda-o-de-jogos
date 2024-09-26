import { BaseController, StatusCode } from "@expressots/core";
import { controller, Get, response } from "@expressots/adapter-express";
import { Response } from "express";
import { GameGenreUseCase } from "./game-genre.usecase";
import { IGameGenreResponseDTO } from "./game-genre.dto";

@controller("/game/genre")
export class GameGenreController extends BaseController {
  constructor(private gameGenreUseCase: GameGenreUseCase) {
    super();
  }

  @Get("/")
  execute(@response() res: Response): IGameGenreResponseDTO {
    return this.callUseCase(
      this.gameGenreUseCase.execute(),
      res,
      StatusCode.OK,
    );
  }
}
