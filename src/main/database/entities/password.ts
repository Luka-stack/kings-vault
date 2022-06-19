import { DbField } from '.';
import { User, UserRepository } from './user';

export interface Password {
  id?: number;
  label: string;
  content: string;
  iv: string;
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
    type: 'TEXT',
  },
  {
    name: 'content',
    type: 'TEXT',
  },
  {
    name: 'iv',
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

const createPassword = (
  { label, content, iv, strength, isPublic }: Password,
  userId: number
): string => {
  const fields = FIELDS.slice(1, FIELDS.length - 1).map((field) => field.name);
  const base = `INSERT INTO ${PasswordRepository.table} (${fields})`;

  const values: string[] = [];
  values.push(`'${label}'`);
  values.push(`'${content}'`);
  values.push(`'${iv}'`);
  values.push(`'${strength}'`);
  values.push("datetime('now', 'localtime')");
  values.push(isPublic ? '1' : '0');
  values.push(userId + '');

  return `${base} VALUES(${values})`;
};

const findAll = (userId?: number): string => {
  let where: string;

  if (userId) {
    where = `userId = ${userId} OR passwds.isPublic = 1`;
  } else {
    where = 'passwds.isPublic = 1';
  }

  const passwdFields =
    'passwds.id, passwds.label, passwds.content, passwds.iv, passwds.strength, passwds.modified, passwds.isPublic';
  const userFields = 'users.id as userId, users.username';

  return `SELECT ${passwdFields}, ${userFields} FROM ${UserRepository.table} as users INNER JOIN ${PasswordRepository.table} as passwds ON passwds.user_id = users.id WHERE ${where}`;
};

const updatePassword = ({
  id,
  label,
  content,
  iv,
  strength,
  isPublic,
}: Password): string => {
  const visibility = isPublic ? '1' : '0';

  return `UPDATE ${PasswordRepository.table} SET label = '${label}', content = '${content}', iv = '${iv}', strength = '${strength}', isPublic = ${visibility}, modified = datetime('now', 'localtime') WHERE id = ${id}`;
};

const findAllSorted = (userId: number): string => {
  const passwdFields =
    'passwds.id, passwds.label, passwds.content, passwds.iv, passwds.strength, passwds.modified, passwds.isPublic';
  const userFields = 'users.id as userId, users.username';

  return `SELECT ${passwdFields}, ${userFields} FROM ${UserRepository.table} as users INNER JOIN ${PasswordRepository.table} as passwds ON passwds.user_id = users.id WHERE userId = ${userId} ORDER BY passwds.modified ASC`;
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
  findAllSorted: findAllSorted,
};
