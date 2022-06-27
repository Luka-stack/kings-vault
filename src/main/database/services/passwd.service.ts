import { BrowserWindow, ipcMain } from 'electron';

import { encrypt } from '../../cipher';
import { CreatePasswdDto } from '../entities/passwd/passwd';
import { User } from '../entities/user/user';
import { PasswdRepository } from '../repositories/passwd.repository';

export class PasswdService {
  constructor(
    private readonly repo: PasswdRepository,
    private readonly window: BrowserWindow
  ) {
    this.startListiners();
  }

  initTable(): void {
    this.repo.initTable();
  }

  async createPasswd(
    passwd: CreatePasswdDto,
    user: User | null
  ): Promise<void> {
    const passwordHash = encrypt(passwd.password);
    const userId = user ? user.id : 1;

    try {
      await this.repo.createPasswd(passwd, passwordHash, userId);
      this.window.webContents.send('passwd:saved', ['success']);
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(userId?: number): Promise<void> {
    try {
      const results = await this.repo.findAll(userId);
      this.window.webContents.send('passwd:foundAll', results);
    } catch (err) {
      console.log(err);
    }
  }

  startListiners(): void {
    ipcMain.on('passwd:create', (_, args: any[]) => {
      const [passwd, user] = args;
      this.createPasswd(passwd, user);
    });

    ipcMain.on('passwd:findAll', (_, args: any[]) => {
      this.findAll(args[0]);
    });
  }
}
