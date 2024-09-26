export interface IUserCreateRequestDTO {
  name: string;
  email: string;
}

export interface IUserCreateResponseDTO {
  id: string;
  name: string;
  email: string;
  message: string;
}
