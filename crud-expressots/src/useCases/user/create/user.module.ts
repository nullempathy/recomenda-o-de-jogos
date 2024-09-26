import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { UserCreateController } from "./user-create.controller";

export const UserModule: ContainerModule = CreateModule([UserCreateController]);
