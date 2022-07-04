export interface User {
  id: number;
  username: string;
  strength: string;
  modified: string;
  notifyStatus: number;
  notifyDays: number;
}

export interface CreateUserDto {
  username: string;
  password: string;
  strength: string;
}
