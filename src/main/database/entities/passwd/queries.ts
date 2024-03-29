import { UserQueries } from '../user/queries';
import { CreatePasswdDto, Passwd } from './passwd';

export const PasswdQueries = {
  table: 'passwds',
  fields: [
    {
      name: 'id',
      type: 'INTEGER PRIMARY KEY',
    },
    {
      name: 'label',
      type: 'TEXT',
    },
    {
      name: 'login',
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
      type: `REFERENCES ${UserQueries.table}(id)`,
    },
  ],

  createTable: (): string => {
    const base = `CREATE TABLE IF NOT EXISTS ${PasswdQueries.table}`;
    const columns = PasswdQueries.fields.map(
      (field) => `${field.name} ${field.type}`
    );

    return `${base} (${columns.join(', ')})`;
  },

  createPasswd: (
    { label, login, strength, isPublic }: CreatePasswdDto,
    { content, iv }: { content: string; iv: string },
    userId: number
  ): string => {
    const fields = PasswdQueries.fields
      .slice(1, PasswdQueries.fields.length - 1)
      .map((field) => field.name);
    const base = `INSERT INTO ${PasswdQueries.table} (${fields})`;

    const values: string[] = [];
    values.push(`'${label}'`);
    values.push(`'${login}'`);
    values.push(`'${content}'`);
    values.push(`'${iv}'`);
    values.push(`'${strength}'`);
    values.push("datetime('now', 'localtime')");
    values.push(isPublic ? '1' : '0');
    values.push(userId + '');

    return `${base} VALUES(${values})`;
  },

  createPasswds: (passwds: Passwd[], userId: number): string => {
    const fields = PasswdQueries.fields
      .slice(1, PasswdQueries.fields.length - 1)
      .map((field) => field.name);
    const base = `INSERT INTO ${PasswdQueries.table} (${fields})`;

    const listOfValues: string[] = [];
    let values;

    passwds.forEach((passwd) => {
      values = [];
      values.push(`'${passwd.label}'`);
      values.push(`'${passwd.login}`);
      values.push(`'${passwd.content}'`);
      values.push(`'${passwd.iv}'`);
      values.push(`'${passwd.strength}'`);
      values.push(`'${passwd.modified}'`);
      values.push(passwd.isPublic ? '1' : '0');
      values.push(userId + '');

      listOfValues.push(`(${values.join(',')})`);
    });

    return `${base} VALUES ${listOfValues.join(',')};`;
  },

  findAll: (userId?: number, onlyUsers?: boolean): string => {
    let where: string;

    if (userId) {
      where = `userId = ${userId}${
        onlyUsers ? '' : ' OR passwds.isPublic = 1'
      }`;
    } else {
      where = 'passwds.isPublic = 1';
    }

    return findWhere(where);
  },

  updatePasswd: (
    id: number,
    { label, login, strength, isPublic }: CreatePasswdDto,
    { content, iv }: { content: string; iv: string }
  ): string => {
    const visibility = isPublic ? '1' : '0';

    return `UPDATE ${PasswdQueries.table} SET label = '${label}', login = '${login}', content = '${content}', iv = '${iv}', strength = '${strength}', isPublic = ${visibility}, modified = datetime('now', 'localtime') WHERE id = ${id}`;
  },

  deletePassword: (id: number): string => {
    return `DELETE FROM ${PasswdQueries.table} WHERE id = ${id}`;
  },
};

const findWhere = (where: string): string => {
  const passwdFields =
    'passwds.id, passwds.label, passwds.login, passwds.content, passwds.iv, passwds.strength, passwds.modified, passwds.isPublic';
  const userFields = 'users.id as userId, users.username';

  return `SELECT ${passwdFields}, ${userFields} FROM ${UserQueries.table} as users INNER JOIN ${PasswdQueries.table} as passwds ON passwds.user_id = users.id WHERE ${where}`;
};
