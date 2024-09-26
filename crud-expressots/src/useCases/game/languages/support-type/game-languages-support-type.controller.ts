import { BaseController, StatusCode } from "@expressots/core";
import { controller, Get, response } from "@expressots/adapter-express";
import { Response } from "express";
import { GameLanguagesSupportTypeUseCase } from "./game-languages-support-type.usecase";
import { IGameLanguagesSupportTypeResponseDTO } from "./game-languages-support-type.dto";

@controller("/game/languages/support-type")
export class GameLanguagesSupportTypeController extends BaseController {
    constructor(private gameLanguagesSupportTypeUseCase: GameLanguagesSupportTypeUseCase) {
	    super();
	}

    @Get("/")
    execute(@response() res: Response): IGameLanguagesSupportTypeResponseDTO {
        return this.callUseCase(
            this.gameLanguagesSupportTypeUseCase.execute(),
            res,
            StatusCode.OK,
        );
    }
}
