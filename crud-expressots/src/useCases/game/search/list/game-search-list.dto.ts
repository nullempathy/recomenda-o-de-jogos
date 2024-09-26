export interface IGameSearchListRequestDTO {
  genres?: Array<string>;
  languages?: Array<string>;
  offset: string;
}

export interface IGameSearchListResponseDTO {
  id: number;
  name: string;
  image_id?: string;
  genres: string[];
  language_supports: Array<{
    id: number;
    language: string;
    language_support_type: string;
    description: string;
  }>;
}
