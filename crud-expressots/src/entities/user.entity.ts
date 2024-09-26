import { provide } from "@expressots/core";
import { randomUUID } from "node:crypto";

@provide(UserEntity)
export class UserEntity {
    id: string;
    name: string;
    email: string;

    constructor() {
        this.id = randomUUID();
    }
}
