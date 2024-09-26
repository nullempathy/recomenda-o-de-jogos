import { provide } from "@expressots/core";
import { AxiosProvider } from "@providers/interceptors/axios.provider";
import { writeFileSync } from "fs";
import { resolve } from "path";

@provide(GameLanguagesLanguageUseCase)
export class GameLanguagesLanguageUseCase {
  constructor(private axiosProvider: AxiosProvider) { }

  private async fetchLanguages() {
    const axiosInstance = this.axiosProvider.getInstance();
    try {
      const response = await axiosInstance.post(
        "https://api.igdb.com/v4/languages",
        "fields checksum, created_at, locale, name, native_name, updated_at; limit 500;",
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      return response.data;
    } catch (err) {
      console.error("Erro no GameLanguageUseCase", err);
      throw new Error("Falha na requisição dos idiomas dos jogos");
    }
  }

  private saveLanguagesToFile(languages: any[]) {
    // Ordena os objetos pelo valor crescente da propriedade 'id'
    const sortedLanguages = languages.sort((languageA, languageB) => {
      return languageA.id - languageB.id;
    });
    const languagesMapNameToId: Record<string, number> = {};
    const languagesMapIdToName: Record<number, string> = {};
    sortedLanguages.forEach((language) => {
      languagesMapNameToId[language.name] = language.id;
      languagesMapIdToName[language.id] = language.name;
    });

    const filePath = resolve(
      __dirname,
      "../../../../constants/languages.constant.ts",
    );

    const fileContent = `
          export const LanguagesConstant: Record<string, number> = ${JSON.stringify(
      languagesMapNameToId,
      null,
      2,
    )};
          export const InvertedLanguagesConstant: Record<number, string> = ${JSON.stringify(
      languagesMapIdToName,
      null,
      2,
    )};
        `;

    writeFileSync(filePath, fileContent, "utf-8");
  }

  async execute() {
    const languages = await this.fetchLanguages();
    this.saveLanguagesToFile(languages);
  }
}
