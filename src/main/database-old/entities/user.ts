import { DbField } from '.';

export interface User {
  id?: number;
  username: string;
  password: string;
  strength: string;
  token: string;
  modified?: string;
}

const FIELDS: DbField[] = [
  {
    name: 'id',
    type: 'INTEGER PRIMARY KEY',
  },
  {
    name: 'username',
    type: 'TEXT UNIQUE',
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
  {
    name: 'notifyStatus',
    type: 'INTEGER',
  },
  {
    name: 'notifyDays',
    type: 'INTEGER',
  },
];

const createTable = (): string => {
  let base = `CREATE TABLE ${UserRepository.table}`;
  const columns = FIELDS.map((field) => `${field.name} ${field.type}`);

  return `${base} (${columns.join(', ')})`;
};

const createUser = (user: User): string => {
  const fields = FIELDS.slice(1).map((field) => field.name);
  let base = `INSERT INTO ${UserRepository.table} (${fields})`;

  let values: string[] = [];
  values.push(`'${user.username}'`);
  values.push(`'${user.password}'`);
  values.push(`'${user.strength}'`);
  values.push(`datetime('now', 'localtime')`);
  values.push(`'${user.token!}'`);
  values.push('1');
  values.push('30');

  return `${base} VALUES(${values})`;
};

const findById = (id: number): string => {
  return `SELECT * FROM ${UserRepository.table} WHERE id = ${id}`;
};

const logIn = (username: string, password: string): string => {
  return `SELECT * FROM ${UserRepository.table} WHERE username = '${username}' AND password = '${password}'`;
};

const updateUser = (
  username: string,
  password: string,
  strength: string
): string => {
  return `UPDATE ${UserRepository.table} SET password = '${password}', strength = '${strength}', modified = datetime('now', 'localtime') WHERE username = '${username}'`;
};

const updatePreferences = (
  id: number,
  notifyStatus: boolean,
  notifyDays: number
): string => {
  return `UPDATE ${UserRepository.table} SET notifyStatus = '${
    notifyStatus ? '1' : '0'
  }', notifyDays = '${notifyDays} WHERE id = ${id}`;
};

export const UserRepository = {
  table: 'users',
  createTableStmt: createTable,
  createUserStmt: createUser,
  updateUserStmt: updateUser,
  updatePreferencesStmt: updatePreferences,
  findByIdStmt: findById,
  logInStmt: logIn,
};
