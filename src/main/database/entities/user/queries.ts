import { CreateUserDto } from './user';

export const UserQueries = {
  table: 'users',
  fields: [
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
      name: 'notifyStatus',
      type: 'INTEGER',
    },
    {
      name: 'notifyDays',
      type: 'INTEGER',
    },
  ],

  createTable: (): string => {
    const base = `CREATE TABLE IF NOT EXISTS ${UserQueries.table}`;
    const columns = UserQueries.fields.map(
      (field) => `${field.name} ${field.type}`
    );

    return `${base} (${columns.join(', ')})`;
  },

  createUser: (user: CreateUserDto): string => {
    const fields = UserQueries.fields.slice(1).map((field) => field.name);
    let base = `INSERT INTO ${UserQueries.table} (${fields})`;

    let values: string[] = [];
    values.push(`'${user.username}'`);
    values.push(`'${user.password}'`);
    values.push(`'${user.strength}'`);
    values.push(`datetime('now', 'localtime')`);
    values.push('1');
    values.push('30');

    return `${base} VALUES(${values})`;
  },

  findById: (id: number): string => {
    return `SELECT * FROM ${UserQueries.table} WHERE id = ${id}`;
  },

  findByCredentials: (username: string, password: string): string => {
    return `SELECT * FROM ${UserQueries.table} WHERE username = '${username}' AND password = '${password}'`;
  },

  updateUser: (user: CreateUserDto): string => {
    return `UPDATE ${UserQueries.table} SET password = '${user.password}', strength = '${user.strength}', modified = datetime('now', 'localtime') WHERE username = '${user.username}'`;
  },

  updatePreferences: (
    username: string,
    notifyStatus: boolean,
    notifyDays: number
  ): string => {
    return `UPDATE ${UserQueries.table} SET notifyStatus = '${
      notifyStatus ? '1' : '0'
    }', notifyDays = '${notifyDays} WHERE username = '${username}'`;
  },
};
