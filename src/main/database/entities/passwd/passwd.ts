export interface Passwd {
  id: number;
  label: string;
  login: string;
  content: string;
  iv: string;
  strength: string;
  isPublic: boolean;
  modified: string;
  userId: number;
  username: string;
}

export interface CreatePasswdDto {
  label: string;
  login: string;
  password: string;
  strength: string;
  isPublic: boolean;
}
