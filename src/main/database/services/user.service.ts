import { BrowserWindow } from 'electron';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly window: BrowserWindow
  ) {}

  initTable(): void {
    this.repo.initTable();
    this.repo.createAnonymousUser();
  }
}
