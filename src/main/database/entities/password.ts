import { DbField } from '.';
import { User, UserRepository } from './user';

export interface Password {
  id?: number;
  label: string;
  password: string;
  strength: string;
  public: boolean;
  modified?: string;
  user?: User;
}

const FIELDS: DbField[] = [
  {
    name: 'id',
    type: 'INTEGER PRIMARY KEY',
  },
  {
    name: 'label',
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
    name: 'public',
    type: 'INTEGER',
  },
  //   {
  //     name: 'user_id',
  //     type: 'INTEGER',
  //   },
  {
    name: 'FOREIGN KEY(user_id)',
    type: `REFERENCES ${UserRepository.table}(id)`,
  },
];

const createTable = (): string => {
  let base = `CREATE TABLE ${PasswordRepository.table}`;
  const columns = FIELDS.map((field) => `${field.name} ${field.type}`);

  return `${base} (${columns.join(', ')})`;
};

const createPassword = (password: Password, userId: number): string => {
  const fields = FIELDS.slice(1, FIELDS.length - 1).map((field) => field.name);
  const base = `INSERT INTO ${PasswordRepository.table} (${fields})`;

  const values: string[] = [];
  values.push(`'${password.label}'`);
  values.push(`'${password.password}'`);
  values.push(`'${password.strength}'`);
  values.push("datetime('now', 'localtime')");
  values.push(password.public ? '1' : '0');
  //   values.push(userId + '');

  return `${base} VALUES(${values})`;
};

const findAll = (): string => {
  return `SELECT * FROM ${PasswordRepository.table} LEFT JOIN ${UserRepository.table} ON ${PasswordRepository.table}.user_id = ${UserRepository.table}.id`;
};

const updatePassword = (
  id: number,
  label: string,
  password: string
): string => {
  return `UPDATE ${PasswordRepository.table} SET label = '${label}' AND password = '${password}' WHERE id = ${id}`;
};

export const PasswordRepository = {
  table: 'passwords',
  createTableStmt: createTable,
  createPasswordStmt: createPassword,
  updatePasswordStmt: updatePassword,
  findAllStmt: findAll,
};
