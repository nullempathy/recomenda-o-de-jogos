import { Container } from "inversify";
import { AppContainer } from "@expressots/core";
import { AppModule } from "@useCases/app/app.module";
import { UserModule } from "@useCases/user/create/user.module";
import { GameModule } from "@useCases/game/game.module";

export const appContainer: AppContainer = new AppContainer({
    autoBindInjectable: false,
});

export const container: Container = appContainer.create([// Add your modules here
    AppModule, UserModule, GameModule]);
