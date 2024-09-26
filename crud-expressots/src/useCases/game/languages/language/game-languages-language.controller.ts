import { BaseController, StatusCode } from "@expressots/core";
import { controller, Get, response } from "@expressots/adapter-express";
import { Response } from "express";
import { GameLanguagesLanguageUseCase } from "./game-languages-language.usecase";
import { IGameLanguagesLanguageResponseDTO } from "./game-languages-language.dto";

@controller("/game/languages/language")
export class GameLanguagesLanguageController extends BaseController {
  constructor(
    private gameLanguagesLanguageUseCase: GameLanguagesLanguageUseCase,
  ) {
    super();
  }

  @Get("/")
  execute(@response() res: Response): IGameLanguagesLanguageResponseDTO {
    return this.callUseCase(
      this.gameLanguagesLanguageUseCase.execute(),
      res,
      StatusCode.OK,
    );
  }
}
