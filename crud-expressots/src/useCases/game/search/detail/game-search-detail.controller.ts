import { BaseController, StatusCode } from "@expressots/core";
import { body, controller, Post, response } from "@expressots/adapter-express";
import { Response } from "express";
import { GameSearchDetailUseCase } from "./game-search-detail.usecase";
import { IGameSearchDetailRequestDTO, IGameSearchDetailResponseDTO } from "./game-search-detail.dto";

@controller("/game/search/detail")
export class GameSearchDetailController extends BaseController {
    constructor(private gameSearchDetailUseCase: GameSearchDetailUseCase) {
	    super();
	}

    @Post("/")
    execute(
      @body() payload: IGameSearchDetailRequestDTO,
      @response() res: Response): IGameSearchDetailResponseDTO {
        return this.callUseCaseAsync(
            this.gameSearchDetailUseCase.execute(payload),
            res,
            StatusCode.OK,
        );
    }
}
