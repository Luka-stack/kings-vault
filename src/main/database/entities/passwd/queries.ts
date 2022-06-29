import { UserQueries } from '../user/queries';
import { CreatePasswdDto } from './passwd';

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
    { label, strength, isPublic }: CreatePasswdDto,
    { content, iv }: { content: string; iv: string },
    userId: number
  ): string => {
    const fields = PasswdQueries.fields
      .slice(1, PasswdQueries.fields.length - 1)
      .map((field) => field.name);
    const base = `INSERT INTO ${PasswdQueries.table} (${fields})`;

    const values: string[] = [];
    values.push(`'${label}'`);
    values.push(`'${content}'`);
    values.push(`'${iv}'`);
    values.push(`'${strength}'`);
    values.push("datetime('now', 'localtime')");
    values.push(isPublic ? '1' : '0');
    values.push(userId + '');

    return `${base} VALUES(${values})`;
  },

  findAll: (userId?: number): string => {
    let where: string;

    if (userId) {
      where = `userId = ${userId} OR passwds.isPublic = 1`;
    } else {
      where = 'passwds.isPublic = 1';
    }

    const passwdFields =
      'passwds.id, passwds.label, passwds.content, passwds.iv, passwds.strength, passwds.modified, passwds.isPublic';
    const userFields = 'users.id as userId, users.username';

    return `SELECT ${passwdFields}, ${userFields} FROM ${UserQueries.table} as users INNER JOIN ${PasswdQueries.table} as passwds ON passwds.user_id = users.id WHERE ${where}`;
  },

  findAllByUserSorted: (userId: number): string => {
    const passwdFields =
      'passwds.id, passwds.label, passwds.content, passwds.iv, passwds.strength, passwds.modified, passwds.isPublic';
    const userFields = 'users.id as userId, users.username';

    return `SELECT ${passwdFields}, ${userFields} FROM ${UserQueries.table} as users INNER JOIN ${PasswdQueries.table} as passwds ON passwds.user_id = users.id WHERE userId = ${userId} ORDER BY passwds.modified ASC`;
  },

  updatePasswd: (
    id: number,
    { label, strength, isPublic }: CreatePasswdDto,
    { content, iv }: { content: string; iv: string }
  ): string => {
    const visibility = isPublic ? '1' : '0';

    return `UPDATE ${PasswdQueries.table} SET label = '${label}', content = '${content}', iv = '${iv}', strength = '${strength}', isPublic = ${visibility}, modified = datetime('now', 'localtime') WHERE id = ${id}`;
  },

  deletePassword: (id: number): string => {
    return `DELETE FROM ${PasswdQueries.table} WHERE id = ${id}`;
  },
};
