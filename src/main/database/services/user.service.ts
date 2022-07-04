import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import bcrypt from 'bcrypt';

import { createHash } from '../../cipher';
import { CreateUserDto } from '../entities/user/user';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  static ANONYMOUS_USER = {
    id: 1,
    username: '_Anonymous',
    password: '',
    strength: '',
  };

  constructor(
    private readonly repo: UserRepository,
    private readonly window: BrowserWindow
  ) {
    this.startListeners();
  }

  async initTable(): Promise<void> {
    try {
      await this.repo.initTable();
      await this.repo.create(UserService.ANONYMOUS_USER);
    } catch (err: any) {
      if (err.errno === 19) return;

      dialog.showErrorBox('Error occurred', 'Cannot initalizate app');
      app.exit();
    }
  }

  async create(user: CreateUserDto): Promise<void> {
    const passwordHash = await bcrypt.hash(user.password, 7);
    user.password = passwordHash;

    try {
      const id = await this.repo.create(user);
      const result = await this.repo.findById(id);
      this.window.webContents.send('user:logIn', 'success', result);
    } catch (err: any) {
      this.window.webContents.send(
        'user:logIn',
        'error',
        err.errno === 19 ? 'Username must be unique' : "Coudn't create user"
      );
    }
  }

  async logIn(username: string, password: string): Promise<void> {
    try {
      const result = await this.repo.findByUsername(username);

      if (!result) {
        return this.window.webContents.send(
          'user:logIn',
          'error',
          'Wrong credentials'
        );
      }

      const correctPassword = await bcrypt.compare(password, result.password);
      if (!correctPassword) {
        return this.window.webContents.send(
          'user:logIn',
          'error',
          'Wrong credentials'
        );
      }

      return this.window.webContents.send('user:logIn', 'success', result);
    } catch (err) {
      this.window.webContents.send(
        'user:logIn',
        'error',
        'Error occurred while logging in'
      );
    }
  }

  async update(user: CreateUserDto): Promise<void> {
    const passwordHash = createHash(user.password);
    user.password = passwordHash;

    try {
      await this.repo.update(user);
      const result = await this.repo.findByUsername(user.username);

      this.window.webContents.send('user:userUpdate', 'success', result);
    } catch (err) {
      return this.window.webContents.send(
        'user:userUpdate',
        'error',
        "Couldn't update user"
      );
    }
  }

  async updatePreferences(
    userId: number,
    notifyStatus: boolean,
    notifyDays: number
  ): Promise<void> {
    try {
      await this.repo.updatePreferences(userId, notifyStatus, notifyDays);
      const result = await this.repo.findById(userId);
      this.window.webContents.send('user:userUpdate', 'success', result);
    } catch (err) {
      this.window.webContents.send(
        'user:userUpdate',
        'error',
        "Couldn't update user"
      );
    }
  }

  startListeners(): void {
    ipcMain.on('user:create', (_event, args: any[]) => {
      this.create(args[0]);
    });

    ipcMain.on('user:logIn', (_, args: any[]) => {
      this.logIn(args[0], args[1]);
    });

    ipcMain.on('user:update', (_, args: any[]) => {
      this.update(args[0]);
    });

    ipcMain.on('user:updatePref', (_, args: any[]) => {
      this.updatePreferences(args[0], args[1], args[2]);
    });
  }
}
