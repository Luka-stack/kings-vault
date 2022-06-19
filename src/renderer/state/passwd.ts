export interface Passwd {
  id: number;
  label: string;
  content: string;
  iv: string;
  strength: string;
  isPublic: boolean;
  modified: string;

  // user fields
  username: string;
  userId: number;
}
