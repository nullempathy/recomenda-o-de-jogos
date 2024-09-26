import { BaseController, StatusCode } from "@expressots/core";
import { body, controller, Post, response } from "@expressots/adapter-express";
import { Response } from "express";
import { GameSearchListUseCase } from "./game-search-list.usecase";
import {
  IGameSearchListRequestDTO,
  IGameSearchListResponseDTO,
} from "./game-search-list.dto";

@controller("/game/search/list")
export class GameSearchListController extends BaseController {
  constructor(private gameSearchListUseCase: GameSearchListUseCase) {
    super();
  }

  @Post("/")
  execute(
    @body() payload: IGameSearchListRequestDTO,
    @response() res: Response): IGameSearchListResponseDTO {
      return this.callUseCaseAsync(
        this.gameSearchListUseCase.execute(payload),
        res,
        StatusCode.OK,
      );
    }
}
