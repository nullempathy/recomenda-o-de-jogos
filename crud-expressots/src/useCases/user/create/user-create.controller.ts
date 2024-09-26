import { BaseController, StatusCode } from "@expressots/core";
import { body, controller, Post, response } from "@expressots/adapter-express";
import { Response } from "express";
import { UserCreateUseCase } from "./user-create.usecase";
import { IUserCreateRequestDTO, IUserCreateResponseDTO } from "./user-create.dto";

@controller("/user/create")
export class UserCreateController extends BaseController {
    constructor(private userCreateUseCase: UserCreateUseCase) {
	    super();
	}

    @Post("/")
    execute(
      @body() payload: IUserCreateRequestDTO,
      @response() res: Response): IUserCreateResponseDTO {
        console.log("verify payload controller: ", payload);
        return this.callUseCase(
            this.userCreateUseCase.execute(payload),
            res,
            StatusCode.OK,
        );
    }
}
