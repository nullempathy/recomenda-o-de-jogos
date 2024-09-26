import { provide } from "@expressots/core";
import {
  IGameSearchDetailRequestDTO,
  IGameSearchDetailResponseDTO,
} from "./game-search-detail.dto";
import { AxiosProvider } from "@providers/interceptors/axios.provider";
import {
  InvertedGenresConstant,
  GenresConstant,
} from "constants/genres.constant";
import {
  LanguagesConstant,
  InvertedLanguagesConstant,
} from "constants/languages.constant";
import { InvertedLanguagesSupportTypesConstant } from "constants/languages-support-types.constant";
import { InvertedCategoriesConstant } from "constants/categories.constant";

@provide(GameSearchDetailUseCase)
export class GameSearchDetailUseCase {
  constructor(private axiosProvider: AxiosProvider) { }

  private formatFirstReleaseDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const dateToString = date.toISOString();
    const onlyDate = dateToString.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    return onlyDate;
  }

  private mapIdsToGenres(genres: Array<number>): string[] {
    const mapGenre = genres.map((genre) => {
      return InvertedGenresConstant[genre];
    });
    return mapGenre;
  }

  private mapIdsToLanguages(languages: Array<object>): Array<object> {
    const mapLanguage = languages.map((objectLanguage) => {
      return {
        ...objectLanguage,
        language: InvertedLanguagesConstant[objectLanguage.language],
        language_support_type:
          InvertedLanguagesSupportTypesConstant[
          objectLanguage.language_support_type
          ],
        description: `${InvertedLanguagesConstant[objectLanguage.language]
          } in ${InvertedLanguagesSupportTypesConstant[objectLanguage.language_support_type]} `,
      };
    });
    return mapLanguage;
  }

  private mapIdToCategory(category: number): string {
    return InvertedCategoriesConstant[category];
  }

  private async fetchGameSearchDetail(gameToSearch: string) {
    const axiosInstance = this.axiosProvider.getInstance();
    const query = `
        fields name, cover.image_id, genres, language_supports.language, 
        language_supports.language_support_type, category, first_release_date,
        platforms.name, summary, involved_companies.company.name, involved_companies.developer,
        involved_companies.publisher, storyline, age_ratings.content_descriptions.description,
        player_perspectives.name, game_modes.name, themes.name; search "${gameToSearch}";
        `;
    try {
      const game = await axiosInstance.post(
        "https://api.igdb.com/v4/games",
        query,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
          },
        },
      );
      return game.data;
    } catch (err) {
      console.error("Erro no GameSearchDetailUseCase", err);
      throw new Error("Falha na requisição de busca dos jogos");
    }
  }

  private formatGameData(gameData: any) {
    gameData.forEach((objectGame) => {
      console.log(objectGame);
      objectGame.first_release_date = this.formatFirstReleaseDate(
        objectGame.first_release_date,
      );
      objectGame.genres = this.mapIdsToGenres(objectGame.genres);
      objectGame.category = this.mapIdToCategory(objectGame.category);
      objectGame.language_supports = this.mapIdsToLanguages(
        objectGame.language_supports,
      );
    });
    return gameData;
  }

  async execute(
    payload: IGameSearchDetailRequestDTO,
  ): Promise<IGameSearchDetailResponseDTO[]> {
    if (payload.search === "") {
      console.error("Nenhum jogo para ser pesquisado foi encontrado.");
      return [];
    }
    const gameToSearch = payload.search;
    const gameData = await this.fetchGameSearchDetail(gameToSearch);
    const gameDataFormatted = this.formatGameData(gameData);
    const response: IGameSearchDetailResponseDTO[] = gameDataFormatted.map((game) => ({
      id: game.id,
      name: game.name,
      image_id: game.cover?.image_id || null,
      genres: game.genres,
      category: game.category,
      first_release_date: game.first_release_date,
      summary: game.summary,
      language_supports: game.language_supports.map((support) => ({
        id: support.id,
        language: support.language,
        language_support_type: support.language_support_type,
        description: support.description,
      })),
      game_modes: game.game_modes.map((mode) => ({
        id: mode.id,
        name: mode.name,
      })),
      involved_companies: game.involved_companies.map((company) => ({
        id: company.id,
        company_name: company.company.name,
        developer: company.developer,
        publisher: company.publisher,
      })),
      platforms: game.platforms.map((platform) => ({
        id: platform.id,
        name: platform.name,
      })),
      player_perspectives: game.player_perspectives.map((perspective) => ({
        id: perspective.id,
        name: perspective.name
      })),
      age_ratings: game.age_ratings.map((rating) => ({
        id: rating.id,
        content_descriptions: rating.content_descriptions
      })),
      themes: game.themes.map((theme) => ({
        id: theme.id,
        name: theme.name
      })),
    }));

    console.log("response: ", JSON.stringify(response, null, 2));
    return response;

  }
}
