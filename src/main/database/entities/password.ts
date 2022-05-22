import { DbField } from '.';
import { User, UserRepository } from './user';

export interface Password {
  id?: number;
  label: string;
  password: string;
  strength: string;
  isPublic: boolean;
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
    name: 'isPublic',
    type: 'INTEGER',
  },
  {
    name: 'user_id',
    type: 'INTEGER',
  },
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
  values.push(password.isPublic ? '1' : '0');
  values.push(userId + '');

  return `${base} VALUES(${values})`;
};

const findAll = (): string => {
  const passwdFields =
    'passwds.id, passwds.label, passwds.password, passwds.strength, passwds.modified, passwds.isPublic';
  const userFields = 'users.id as userId, users.username';

  return `SELECT ${passwdFields}, ${userFields} FROM ${UserRepository.table} as users INNER JOIN ${PasswordRepository.table} as passwds ON passwds.user_id = users.id`;
};

const updatePassword = ({
  id,
  label,
  password,
  strength,
  isPublic,
}: Password): string => {
  const visibility = isPublic ? '1' : '0';

  return `UPDATE ${PasswordRepository.table} SET label = '${label}', password = '${password}', strength = '${strength}', isPublic = ${visibility}, modified = datetime('now', 'localtime') WHERE id = ${id}`;
};

const deletePassword = (id: number): string => {
  return `DELETE FROM ${PasswordRepository.table} WHERE id = ${id}`;
};

export const PasswordRepository = {
  table: 'passwords',
  createTableStmt: createTable,
  createPasswordStmt: createPassword,
  updatePasswordStmt: updatePassword,
  deletePasswordStmt: deletePassword,
  findAllStmt: findAll,
};
