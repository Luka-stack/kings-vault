import { app, BrowserWindow, dialog, ipcMain } from 'electron';

import { exportPasswds, importPasswds } from '../../backuper';
import { AES256Ecryption } from '../../cipher';
import { CreatePasswdDto, Passwd } from '../entities/passwd/passwd';
import { PasswdRepository } from '../repositories/passwd.repository';
import { UserService } from './user.service';

export class PasswdService {
  constructor(
    private readonly repo: PasswdRepository,
    private readonly window: BrowserWindow
  ) {
    this.startListeners();
  }

  async initTable(): Promise<void> {
    try {
      await this.repo.initTable();
    } catch (err) {
      dialog.showErrorBox('Error occurred', 'Cannot initalizate app');
      app.exit();
    }
  }

  async create(passwd: CreatePasswdDto, userId: number | null): Promise<void> {
    const passwordHash = AES256Ecryption(passwd.password);
    const id = userId || UserService.ANONYMOUS_USER.id;

    try {
      await this.repo.create(passwd, passwordHash, id);
      this.window.webContents.send('passwd:saved', 'success');
    } catch (err) {
      this.window.webContents.send(
        'passwd:saved',
        'error',
        "Coudn't saved password"
      );
    }
  }

  async findAll(userId?: number): Promise<void> {
    try {
      const results = await this.repo.findAll(userId);
      this.window.webContents.send('passwd:foundAll', 'success', results);
    } catch (err) {
      this.window.webContents.send(
        'passwd:foundAll',
        'error',
        'Error occurred while fetching passwords'
      );
    }
  }

  async update(passwdId: number, passwd: CreatePasswdDto): Promise<void> {
    const passwordHash = AES256Ecryption(passwd.password);

    try {
      await this.repo.update(passwdId, passwd, passwordHash);
      this.window.webContents.send('passwd:saved', 'success');
    } catch (err) {
      this.window.webContents.send(
        'passwd:saved',
        'error',
        "Couldn't update password"
      );
    }
  }

  async delete(passwdId: number): Promise<void> {
    try {
      await this.repo.delete(passwdId);
      this.window.webContents.send('passwd:deleted', 'success', passwdId);
    } catch (err) {
      this.window.webContents.send(
        'passwd:deleted',
        'error',
        "Couldn't delete password"
      );
    }
  }

  async exportPasswds(path: string, userId?: number): Promise<void> {
    let passwds: Passwd[];

    if (userId) {
      passwds = await this.repo.findAll(userId, true);
    } else {
      passwds = await this.repo.findAll();
    }

    try {
      await exportPasswds(path, passwds);
      this.window.webContents.send(
        'passwd:saved',
        'success',
        'Successfully exported passwords'
      );
    } catch (err) {
      this.window.webContents.send(
        'passwd:saved',
        'error',
        'Error occurred while importing passwords'
      );
    }
  }

  async importPasswds(filePath: string, userId?: number): Promise<void> {
    const actualUserId = userId || UserService.ANONYMOUS_USER.id;
    let passwds: Passwd[];

    try {
      passwds = await importPasswds(filePath);
    } catch (err) {
      return this.window.webContents.send(
        'passwd:saved',
        'error',
        "Couldn't import passwords. Corrupted file"
      );
    }

    try {
      await this.repo.createPasswords(passwds, actualUserId);
      this.findAll(userId);

      this.window.webContents.send(
        'passwd:saved',
        'success',
        'Successfully imported passwords'
      );
    } catch (err) {
      this.window.webContents.send(
        'passwd:saved',
        'error',
        'Error occurred while importing passwords'
      );
    }
  }

  startListeners(): void {
    ipcMain.on('passwd:create', (_, args: any[]) => {
      const [passwd, user] = args;
      this.create(passwd, user);
    });

    ipcMain.on('passwd:findAll', (_, args: any[]) => {
      this.findAll(args[0]);
    });

    ipcMain.on('passwd:update', (_, args: any[]) => {
      this.update(args[0], args[1]);
    });

    ipcMain.on('passwd:delete', (_, args: any[]) => {
      this.delete(args[0]);
    });

    ipcMain.on('passwd:export', (_, args: any[]) => {
      this.exportPasswds(args[0], args[1]);
    });

    ipcMain.on('passwd:import', (_, args: any[]) => {
      this.importPasswds(args[0], args[1]);
    });
  }
}
