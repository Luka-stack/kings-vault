export interface User {
  id: number;
  username: string;
  password: string;
  strength: string;
  modified: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  strength: string;
}
