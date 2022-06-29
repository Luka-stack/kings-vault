export interface Passwd {
  id: number;
  label: string;
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
  password: string;
  strength: string;
  isPublic: boolean;
}
