import { provide } from "@expressots/core";
import { AxiosProvider } from "@providers/interceptors/axios.provider";
import { writeFileSync } from "fs";
import { resolve } from "path";

@provide(GameLanguagesSupportTypeUseCase)
export class GameLanguagesSupportTypeUseCase {
  constructor(private axiosProvider: AxiosProvider) { }

  private saveLanguagesSupportTypesToFile(languagesSupportTypes: any[]) {
    const languagesSupportTypesMapNameToId: Record<string, number> = {};
    const languagesSupportTypesMapIdToName: Record<number, string> = {};

    languagesSupportTypes.forEach((languageSupportTypes) => {
      languagesSupportTypesMapNameToId[languageSupportTypes.name] =
        languageSupportTypes.id;
      languagesSupportTypesMapIdToName[languageSupportTypes.id] =
        languageSupportTypes.name;
    });

    const filePath = resolve(
      __dirname,
      "../../../../constants/languages-support-types.constant.ts",
    );

    const fileContent = `
          export const LanguagesSupportTypesConstant: Record<string, number> = ${JSON.stringify(
      languagesSupportTypesMapNameToId,
      null,
      2,
    )};
          export const InvertedLanguagesSupportTypesConstant: Record<number, string> = ${JSON.stringify(
      languagesSupportTypesMapIdToName,
      null,
      2,
    )};
        `;

    writeFileSync(filePath, fileContent, "utf-8");
  }

  private async fetchLanguagesSupportsTypes() {
    const axiosInstance = this.axiosProvider.getInstance();
    const query = `
      fields name;
    `;

    try {
      const response = await axiosInstance.post(
        "https://api.igdb.com/v4/language_support_types",
        query,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      return response.data;
    } catch (err) {
      console.error("Erro no GameLanguagesSupportTypeUseCase", err);
      throw new Error(
        "Falha na requisição dos tipos de suporte que o idioma implementa nos jogos",
      );
    }
  }

  async execute() {
    const languagesSupportsTypes = await this.fetchLanguagesSupportsTypes();
    this.saveLanguagesSupportTypesToFile(languagesSupportsTypes);
  }
}
