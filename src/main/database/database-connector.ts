import sqlite from 'sqlite3';
import { execSync } from 'child_process';
import fs from 'fs';
import { UserDatabase } from './entities/user';

export class DatabaseConnector {
  private _db!: sqlite.Database;

  constructor(private readonly dbFile: string) {
    this.initDatabase(dbFile);
  }

  initDatabase(dbFile: string): sqlite.Database {
    let db: sqlite.Database;
    if (!fs.existsSync(dbFile)) {
      db = new sqlite.Database(dbFile);
      execSync('attrib +h ' + dbFile);

      this.initTables(db);
    }

    return db!;
  }

  initTables(db: sqlite.Database): void {
    const base = `CREATE TABLE ${UserDatabase.table}`;
    const fields: string[] = [];

    UserDatabase.fields.forEach((field) => {
      return fields.push(`${field.name} ${field.type}`);
    });

    console.log(`${base} (${fields.join(',')})`);
    db.run(`${base} (${fields.join(',')})`);
  }

  close(): void {
    this._db.close();
  }
}
