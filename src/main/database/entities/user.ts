import { DbField } from '.';

const FIELDS: DbField[] = [
  {
    name: 'id',
    type: 'INTEGER PRIMARY KEY',
  },
  {
    name: 'username',
    type: 'TEXT',
  },
  {
    name: 'password',
    type: 'TEXT',
  },
  {
    name: 'strength',
    type: 'TEXT',
  },
  {
    name: 'modified',
    type: 'TEXT',
  },
  {
    name: 'token',
    type: 'TEXT',
  },
];

interface UserEntity {
  table: string;
  fields: DbField[];
}

export const UserDatabase: UserEntity = {
  table: 'users',
  fields: FIELDS,
};

export class User {}
