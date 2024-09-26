import { provide } from "@expressots/core";
import { AxiosProvider } from "@providers/interceptors/axios.provider";
import { writeFileSync } from "fs";
import { resolve } from "path";

@provide(GameGenreUseCase)
export class GameGenreUseCase {
  constructor(private axiosProvider: AxiosProvider) { }

  private async fetchGenres() {
    const axiosInstance = this.axiosProvider.getInstance();
    try {
      const response = await axiosInstance.post(
        "https://api.igdb.com/v4/genres",
        "fields checksum, created_at, name, slug, updated_at, url; limit 500;",
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      return response.data;
    } catch (err) {
      console.error("Erro no GameGenreUseCase", err);
      throw new Error("Falha na requisição dos genêros dos jogos");
    }
  }

  private saveGenresToFile(genres: any[]) {
    const genresMapSlugToId: Record<string, number> = {};
    const genresMapIdToSlug: Record<number, string> = {};

    genres.forEach((genre) => {
      genresMapSlugToId[genre.slug] = genre.id;
      genresMapIdToSlug[genre.id] = genre.slug;
    });

    const filePath = resolve(
      __dirname,
      "../../../constants/genres.constant.ts",
    );

    const fileContent = `
          export const GenresConstant: Record<string, number> = ${JSON.stringify(
      genresMapSlugToId,
      null,
      2,
    )};
          export const InvertedGenresConstant: Record<number, string> = ${JSON.stringify(
      genresMapIdToSlug,
      null,
      2,
    )};
        `;

    writeFileSync(filePath, fileContent, "utf-8");
  }

  async execute() {
    const genres = await this.fetchGenres();
    this.saveGenresToFile(genres);
  }
}
