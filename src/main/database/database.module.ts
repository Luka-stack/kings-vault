import fs from 'fs';
import { execSync } from 'child_process';
import sqlite from 'sqlite3';

import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { PasswdService } from './services/passwd.service';
import { PasswdRepository } from './repositories/passwd.repository';
import { BrowserWindow } from 'electron';

export class DatabaseModule {
  private _db!: sqlite.Database;
  private _userService!: UserService;
  private _passwdService!: PasswdService;

  constructor(
    private readonly filePath: string,
    private readonly window: BrowserWindow
  ) {
    this.createConnection();
    this.initServices();
    this.initTables();
  }

  private createConnection(): void {
    this._db = new sqlite.Database(this.filePath);

    if (!fs.existsSync(this.filePath)) {
      execSync('attrib +h ' + this.filePath);
    }
  }

  private initServices(): void {
    this._userService = new UserService(
      new UserRepository(this._db),
      this.window
    );
    this._passwdService = new PasswdService(
      new PasswdRepository(this._db),
      this.window
    );
  }

  private initTables(): void {
    this._db.parallelize(() => {
      this._userService.initTable();
      this._passwdService.initTable();
    });
  }
}
