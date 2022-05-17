import sqlite, { RunResult } from 'sqlite3';
import { execSync } from 'child_process';
import fs from 'fs';
import { User, UserRepository } from './entities/user';
import crypto from 'crypto';
import { BrowserWindow, ipcMain } from 'electron';

export class PersistentService {
  private _db!: sqlite.Database;

  constructor(
    private readonly dbFile: string,
    private readonly mainWindow: BrowserWindow
  ) {
    this._db = this.initDatabase(dbFile);
  }

  initDatabase(dbFile: string): sqlite.Database {
    if (!fs.existsSync(dbFile)) {
      let db = new sqlite.Database(dbFile);
      execSync('attrib +h ' + dbFile);

      this.initTables(db);
      return db;
    }

    return new sqlite.Database(dbFile);
  }

  initTables(db: sqlite.Database): void {
    // create users table
    db.run(
      UserRepository.createTableStmt(),
      (_: RunResult, err: Error | null) => {
        if (err) {
          // TODO: Implement error handling
          console.log("Couldn't create users table", err);
        }
      }
    );

    // create passwords table
  }

  createUser(username: string, password: string, strength: string): void {
    const token = uuid();
    const hasher = crypto.createHmac('sha256', token);
    const passwordHash = hasher.update(password).digest('base64');

    const user: User = {
      username,
      password: passwordHash,
      strength,
      token: token,
    };

    const stmt = UserRepository.createUserStmt(user);
    this._db.run(stmt, (result: any, err: Error | null) => {
      if (err) {
        // TODO: Implement error handling
        console.log("Couldn't create user", err);
        return;
      }

      if (result && result.errno) {
        this.mainWindow.webContents.send('user:createResponse', [
          'error',
          'Username has to bo unique',
        ]);
        return;
      }

      this.mainWindow.webContents.send('user:createResponse', [
        'success',
        user,
      ]);
    });
  }

  close(): void {
    this._db.close();
  }
}

const uuid = () => {
  let dt = new Date().getTime();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};
