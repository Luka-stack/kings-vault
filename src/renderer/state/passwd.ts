export interface Passwd {
  id: number;
  label: string;
  password: string;
  strength: string;
  isPublic: boolean;
  modified: string;

  // user fields
  username: string;
  userId: number;
}
