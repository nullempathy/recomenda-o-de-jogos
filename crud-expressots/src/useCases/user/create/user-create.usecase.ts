import { UserEntity } from "@entities/user.entity";
import { provide } from "@expressots/core";
import { IUserCreateRequestDTO, IUserCreateResponseDTO } from "./user-create.dto";
import { inject } from "inversify";

@provide(UserCreateUseCase)
export class UserCreateUseCase {
  constructor(
    @inject(UserEntity) private user: UserEntity
  ) {}
  execute(payload: IUserCreateRequestDTO): IUserCreateResponseDTO {
    console.log("verify payload usercase: ", payload);
    const { name, email } = payload;
    console.log("name do payload: ", name);
    console.log("email do payload: ", email);
    console.log("this atual: ", this);
    console.log("this.user: ", this.user);
    this.user.name = name;
    this.user.email = email;

    const response: IUserCreateResponseDTO = {
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      message: "User created successfully"
    };

    return response;
  }
}
