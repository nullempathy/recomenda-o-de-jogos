import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { GameSearchListController } from "./search/list/game-search-list.controller";
import { GameGenreController } from "./genre/game-genre.controller";
import { GameLanguagesLanguageController } from "./languages/language/game-languages-language.controller";
import { GameLanguagesSupportTypeController } from "./languages/support-type/game-languages-support-type.controller";
import { GameSearchDetailController } from "./search/detail/game-search-detail.controller";

export const GameModule: ContainerModule = CreateModule([GameSearchListController, GameGenreController, GameLanguagesLanguageController, GameLanguagesSupportTypeController, GameSearchDetailController]);
