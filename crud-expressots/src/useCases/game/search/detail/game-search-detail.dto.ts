export interface IGameSearchDetailRequestDTO {
    search: string;
}

export interface IGameSearchDetailResponseDTO {
    id: number;
    name: string;
    image_id?: string;
    first_release_date: string;
    genres: string[];
    language_supports: Array<{
        id: number;
        language: string;
        language_support_type: string;
        description: string;
    }>;
    category: string;
    game_modes: Array<{
      id: number;
      name: string;
    }>;
    involved_companies: Array<{
      id: number;
      company_name: string;
      developer: boolean;
      publisher: boolean;
    }>;
    platforms: Array<{
      id: number;
      name: string;
    }>;
    player_perspectives: Array<{
      id: number;
      name: string;
    }>;
    age_ratings: Array<{
      id: number;
      content_descriptions: Array<{
        id: number;
        description: string;
      }>;
    }>
    summary: string;
    themes: Array<{
      id: number;
      name: string;
    }>
}
