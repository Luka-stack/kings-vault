import sqlite, { RunResult } from 'sqlite3';
import { execSync } from 'child_process';
import fs from 'fs';
import { User, UserRepository } from './entities/user';
import { BrowserWindow } from 'electron';
import { PasswordRepository } from './entities/password';
import { createHash, encrypt } from '../cipher';

export class PersistentService {
  private _db!: sqlite.Database;
  private _anonymous!: User;

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

    let db = new sqlite.Database(dbFile);
    db.get(UserRepository.findByIdStmt(1), (err: Error | null, row: any) => {
      if (err) {
        // TODO: Implement error handling
        console.log("Couldn't find anonymous user", err);
      }

      this._anonymous = row;
    });

    return db;
  }

  initTables(db: sqlite.Database): void {
    db.parallelize(() => {
      db.serialize(() => {
        db.run(
          UserRepository.createTableStmt(),
          (_: RunResult, err: Error | null) => {
            if (err) {
              // TODO: Implement error handling
              console.log("Couldn't create users table", err);
            }
          }
        );

        this._anonymous = {
          id: 1,
          username: '_Anonymous',
          password: '',
          strength: '',
          token: uuid(),
        };
        db.run(
          UserRepository.createUserStmt(this._anonymous),
          (_result: any, err: Error | null) => {
            if (err) {
              // TODO: Implement error handling
              return console.log("Couldn't create anonymous user", err);
            }
          }
        );
      });

      db.run(
        PasswordRepository.createTableStmt(),
        (_: RunResult, err: Error | null) => {
          if (err) {
            // TODO: Implement error handling
            console.log("Couldn't create password table", err);
          }
        }
      );
    });
  }

  // users
  createUser(username: string, password: string, strength: string): void {
    const passwordHash = createHash(password);

    const user: User = {
      username,
      password: passwordHash,
      strength,
      token: uuid(),
    };

    this._db.serialize(() => {
      let stmt = UserRepository.createUserStmt(user);
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
      });

      stmt = UserRepository.logInStmt(username, passwordHash);
      this._db.get(stmt, (err: Error | null, row: any) => {
        if (err) {
          // TODO: Implement error handling
          return console.log("Couldn't find user", err);
        }

        this.mainWindow.webContents.send('user:formRes', ['success', row]);
      });
    });
  }

  logIn(username: string, password: string): void {
    const passwordHash = createHash(password);

    const stmt = UserRepository.logInStmt(username, passwordHash);
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

      return this.mainWindow.webContents.send('user:formRes', [
        'error',
        'Wrong password or username',
      ]);
    });
  }

  updateUser(username: string, password: string, strength: string): void {
    const passwordHash = createHash(password);

    this._db.serialize(() => {
      let stmt = UserRepository.updateUserStmt(
        username,
        passwordHash,
        strength
      );
      this._db.run(stmt, (_result: any, err: Error | null) => {
        if (err) {
          // TODO: Implement error handling
          return console.log("Couldn't update user", err);
        }
      });

      stmt = UserRepository.logInStmt(username, passwordHash);
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

  uupdatePreferences(
    id: number,
    notifyStatus: boolean,
    notifyDays: number
  ): void {
    this._db.serialize(() => {
      let stmt = UserRepository.updatePreferencesStmt(
        id,
        notifyStatus,
        notifyDays
      );
      this._db.run(stmt, (_result: any, err: Error | null) => {
        if (err) {
          // TODO: Implement error handling
          return console.log('Couldnt update user', err);
        }

        stmt = UserRepository.findByIdStmt(id);
        this._db.all(stmt, (err: Error | null, result: any[]) => {
          if (err) {
            // TODO: Implement error handling
            return console.log("Couldn't find user", err);
          }

          if (result.length) {
            return this.mainWindow.webContents.send(
              'user:userUpdate',
              result[0]
            );
          }
        });
      });
    });
  }

  // passwords
  createPasswd(
    passwd: {
      label: string;
      password: string;
      strength: string;
      isPublic: boolean;
    },
    user: { id: number; token: string } | undefined
  ): void {
    const passwordUser = user ? user : this._anonymous;

    const passwordHash = encrypt(passwd.password);
    const passwordObject = {
      label: passwd.label,
      content: passwordHash.content,
      iv: passwordHash.iv,
      strength: passwd.strength,
      isPublic: passwd.isPublic,
    };

    this._db.serialize(() => {
      let stmt = PasswordRepository.createPasswordStmt(
        passwordObject,
        passwordUser.id!
      );

      this._db.run(stmt, (_result: any, err: Error | null) => {
        if (err) {
          // TODO: Implement error handling
          this.mainWindow.webContents.send('passwd:saved', ['error']);
          return console.log("Couldn't create password", err);
        }
      });

      return this.mainWindow.webContents.send('passwd:saved', ['success', '']);
    });
  }

  updatePasswd(passwd: {
    id: number;
    label: string;
    password: string;
    strength: string;
    isPublic: boolean;
  }): void {
    const passwordHash = encrypt(passwd.password);
    const passwordObject = {
      id: passwd.id,
      label: passwd.label,
      content: passwordHash.content,
      iv: passwordHash.iv,
      strength: passwd.strength,
      isPublic: passwd.isPublic,
    };

    let stmt: string;
    this._db.serialize(() => {
      stmt = PasswordRepository.updatePasswordStmt(passwordObject);

      this._db.run(stmt, (_result: any, err: Error | null) => {
        if (err) {
          // TODO: Implement error handling
          this.mainWindow.webContents.send('passwd:saved', ['error']);
          return console.log("Couldn't update password", err);
        }
      });

      return this.mainWindow.webContents.send('passwd:saved', ['success']);
    });
  }

  deletePasswd(id: number): void {
    let stmt: string;
    this._db.serialize(() => {
      stmt = PasswordRepository.deletePasswordStmt(id);
      this._db.run(stmt, (_result: any, err: Error | null) => {
        if (err) {
          // TODO: Implement error handling
          return console.log("Couldn't delete password", err);
        }

        return this.mainWindow.webContents.send('passwd:deleted', id);
      });
    });
  }

  findAll(userId?: number): void {
    const stmt = PasswordRepository.findAllStmt(userId);
    this._db.all(stmt, (err: Error | null, result: any[]) => {
      if (err) {
        // TODO: Implement error handling
        return console.log("Couldn't find passwords", err);
      }

      return this.mainWindow.webContents.send('passwd:foundAll', result);
    });
  }

  findAllByModified(userId: number, maxModifiedInMilli: number): void {
    const stmt = PasswordRepository.findAllSorted(userId);
    this._db.serialize(() => {
      this._db.all(stmt, (err: Error | null, result: any[]): void => {
        if (err) {
          // TODO: Implement error handling
          return console.log("Couldn't find passwords", err);
        }

        const passwords = result.filter(
          (passwd) =>
            Date.now() - new Date(passwd.modified).getTime() >
            maxModifiedInMilli
        );

        return this.mainWindow.webContents.send(
          'passwd:foundAllOld',
          passwords
        );
      });
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
