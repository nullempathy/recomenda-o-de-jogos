import { provide } from "@expressots/core";
import { AxiosProvider } from "@providers/interceptors/axios.provider";
import {
    GenresConstant,
    InvertedGenresConstant,
} from "constants/genres.constant";
import {
    IGameSearchListRequestDTO,
    IGameSearchListResponseDTO,
} from "./game-search-list.dto";
import {
    LanguagesConstant,
    InvertedLanguagesConstant,
} from "constants/languages.constant";
import { InvertedLanguagesSupportTypesConstant } from "constants/languages-support-types.constant";

@provide(GameSearchListUseCase)
export class GameSearchListUseCase {
    constructor(private axiosProvider: AxiosProvider) {}

    private mapGenresToIds(genres: Array<string>): number[] {
        const mapGenre = genres.map((genre) => {
            return GenresConstant[genre];
        });
        return mapGenre;
    }

    private mapLanguagesToIds(languages: Array<string>): number[] {
        const mapLanguage = languages.map((language) => {
            return LanguagesConstant[language];
        });
        return mapLanguage;
    }

    private async fetchGameSearchListWithoutGenres(languageIds: string) {
        const axiosInstance = this.axiosProvider.getInstance();
        const query = `
        fields name, cover.image_id, genres, language_supports.language, 
        language_supports.language_support_type; limit 3;
        language_supports.language = (${languageIds});
        `;
        try {
            const games = await axiosInstance.post(
                "https://api.igdb.com/v4/games",
                query,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "text/plain",
                    },
                },
            );
            return games.data;
        } catch (err) {
            console.error("Erro no GameSearchUseCase", err);
            throw new Error(
                "Falha na requisição de busca dos jogos sem generos",
            );
        }
    }

    private async fetchGameSearchListWithoutLanguages(genreIds: string) {
        const axiosInstance = this.axiosProvider.getInstance();
        const query = `
        fields name, cover.image_id, genres, language_supports.language, 
        language_supports.language_support_type; limit 3;
        where genres = (${genreIds});
        `;
        try {
            const games = await axiosInstance.post(
                "https://api.igdb.com/v4/games",
                query,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "text/plain",
                    },
                },
            );
            return games.data;
        } catch (err) {
            console.error("Erro no GameSearchUseCase", err);
            throw new Error(
                "Falha na requisição de busca dos jogos sem linguagens",
            );
        }
    }

    private async fetchGameSearchList(genreIds: string, languageIds: string, currentOffset: string) {
        const axiosInstance = this.axiosProvider.getInstance();
        const query = `
        fields name, cover.image_id, genres, language_supports.language, 
        language_supports.language_support_type; limit 10; offset ${currentOffset};
        where genres = (${genreIds}) & language_supports.language = (${languageIds});
        `;
        try {
            const games = await axiosInstance.post(
                "https://api.igdb.com/v4/games",
                query,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "text/plain",
                    },
                },
            );
            return games.data;
        } catch (err) {
            console.error("Erro no GameSearchUseCase", err);
            throw new Error("Falha na requisição de busca dos jogos");
        }
    }

    private formatGameData(gamesData: any) {
        gamesData.forEach((objectGame) => {
            const newGenres = objectGame.genres.map((genreId: number) => {
                return InvertedGenresConstant[genreId];
            });

            const newLanguageSupports = objectGame.language_supports.map(
                (objectLanguage) => {
                    return {
                        ...objectLanguage,
                        language:
                            InvertedLanguagesConstant[
                                objectLanguage.language
                            ] || objectLanguage.language,
                        language_support_type:
                            InvertedLanguagesSupportTypesConstant[
                                objectLanguage.language_support_type
                            ] || objectLanguage.language_support_type,
                        description: `${
                            InvertedLanguagesConstant[objectLanguage.language]
                        } in ${InvertedLanguagesSupportTypesConstant[objectLanguage.language_support_type]}`,
                    };
                },
            );
            objectGame.genres = newGenres;
            objectGame.language_supports = newLanguageSupports;
        });
        return gamesData;
    }

    async execute(
        payload: IGameSearchListRequestDTO,
    ): Promise<IGameSearchListResponseDTO[]> {
        const genres = payload.genres || [];
        const languages = payload.languages || [];
        const currentOffset = payload.offset;
        const genreIds = this.mapGenresToIds(genres);
        const languageIds = this.mapLanguagesToIds(languages);
        let genreIdsIsNotEmpty = 1;
        let languageIdsIsNotEmpty = 1;
        let gamesData: any;
        if (genreIds.length === 0 && languageIds.length === 0) {
            console.error("Nenhum gênero e idioma válido foi encontrado.");
            return [];
        }
        const genreIdsString = genreIds.join(",");
        const languageIdsString = languageIds.join(",");

        if (genreIds.length === 0) {
            genreIdsIsNotEmpty = 0;
            gamesData =
              console.log("languageIdsString: ", languageIdsString);
                await this.fetchGameSearchListWithoutGenres(languageIdsString);
        }

        if (languageIds.length === 0) {
            languageIdsIsNotEmpty = 0;
            gamesData =
                await this.fetchGameSearchListWithoutLanguages(genreIdsString);
        }

        if (genreIdsIsNotEmpty && languageIdsIsNotEmpty) {
            gamesData = await this.fetchGameSearchList(
                genreIdsString,
                languageIdsString,
                currentOffset,
            );
        }

        const gamesDataFormatted = this.formatGameData(gamesData);
        console.log("gamesDataFormatted: ", gamesDataFormatted);

        const response: IGameSearchListResponseDTO[] = gamesDataFormatted.map(
            (game) => ({
                id: game.id,
                name: game.name,
                image_id: game.cover?.image_id || null,
                genres: game.genres,
                language_supports: game.language_supports.map((support) => ({
                    language_support_id: support.id,
                    language: support.language,
                    language_support_type: support.language_support_type,
                    description: support.description,
                })),
            }),
        );
        console.log("response: ", JSON.stringify(response, null, 2));
        return response;
    }
}
