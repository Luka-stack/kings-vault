import sqlite, { RunResult } from 'sqlite3';
import { execSync } from 'child_process';
import fs from 'fs';
import { User, UserRepository } from './entities/user';
import crypto from 'crypto';
import { BrowserWindow, ipcMain } from 'electron';
import { Password, PasswordRepository } from './entities/password';

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
    db.parallelize(() => {
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
      db.run(
        PasswordRepository.createTableStmt(),
        (_: RunResult, err: Error | null) => {
          if (err) {
            // TODO: Implement error handling
            console.log("Couldn't create users table", err);
          }
        }
      );
    });
  }

  // users

  createUser(username: string, password: string, strength: string): void {
    const token = uuid();
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('base64');

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
        return console.log("Couldn't create user", err);
      }

      if (result && result.errno) {
        return this.mainWindow.webContents.send('user:formRes', [
          'error',
          'Username has to bo unique',
        ]);
      }

      this.mainWindow.webContents.send('user:formRes', ['success', user]);
    });
  }

  logIn(username: string, password: string): void {
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('base64');

    const stmt = UserRepository.findOneStmt(username, passwordHash);
    this._db.all(stmt, (err: Error | null, result: any[]) => {
      if (err) {
        // TODO: Implement error handling
        return console.log("Couldn't create user", err);
      }

      if (result.length) {
        return this.mainWindow.webContents.send('user:formRes', [
          'success',
          result[0],
        ]);
      }

      return this.mainWindow.webContents.send('user:formRes', [
        'error',
        'Wrong password or username',
      ]);
    });
  }

  updateUser(username: string, password: string, strength: string): void {
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('base64');
    let stmt = UserRepository.updateUserStmt(username, passwordHash, strength);

    this._db.serialize(() => {
      this._db.run(stmt, (_result: any, err: Error | null) => {
        if (err) {
          // TODO: Implement error handling
          return console.log("Couldn't create user", err);
        }
      });

      stmt = UserRepository.findOneStmt(username, passwordHash);
      this._db.all(stmt, (err: Error | null, result: any[]) => {
        if (err) {
          // TODO: Implement error handling
          return console.log("Couldn't find user", err);
        }

        if (result.length) {
          return this.mainWindow.webContents.send('user:formRes', [
            'success',
            result[0],
          ]);
        }
      });
    });
  }

  // passwords
  createPasswd(
    password: {
      label: string;
      password: string;
      strength: string;
      public: boolean;
    },
    user: { id: number; token: string }
  ): void {
    const passwordHash = crypto
      .createHmac('sha256', user.token)
      .update(password.password)
      .digest('base64');

    password.password = passwordHash;

    const stmt = PasswordRepository.createPasswordStmt(password, user.id);
    this._db.run(stmt, (result: any, err: Error | null) => {
      if (err) {
        // TODO: Implement error handling
        return console.log("Couldn't create password", err);
      }

      console.log(result);

      // if (result && result.errno) {
      //   return this.mainWindow.webContents.send('user:formRes', [
      //     'error',
      //     'Username has to bo unique',
      //   ]);
      // }

      // this.mainWindow.webContents.send('user:formRes', ['success', user]);
    });
  }

  findAll(): void {
    const stmt = PasswordRepository.findAllStmt();
    this._db.all(stmt, (err: Error | null, result: any[]) => {
      if (err) {
        // TODO: Implement error handling
        return console.log("Couldn't create user", err);
      }

      console.log(result);
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
