import { CreatePasswdDto, CreateUserDto } from './state';

export namespace IpcUser {
  export const createUser = (user: CreateUserDto) => {
    window.electron.ipcRenderer.sendMessage('user:create', [user]);
  };

  export const logIn = (username: string, password: string) => {
    window.electron.ipcRenderer.sendMessage('user:logIn', [username, password]);
  };

  export const updateUser = (user: CreateUserDto) => {
    window.electron.ipcRenderer.sendMessage('user:update', [user]);
  };

  export const updateUserPreferences = (
    userId: number,
    notifyStatus: boolean,
    notifyDays: number
  ) => {
    window.electron.ipcRenderer.sendMessage('user:updatePref', [
      userId,
      notifyStatus,
      notifyDays,
    ]);
  };
}

export namespace IpcPasswd {
  export const findAll = (userId?: number) => {
    window.electron.ipcRenderer.sendMessage('passwd:findAll', [userId]);
  };

  export const createPasswd = (passwd: CreatePasswdDto, userId?: number) => {
    window.electron.ipcRenderer.sendMessage('passwd:create', [passwd, userId]);
  };

  export const updatePasswd = (passwdId: number, passwd: CreatePasswdDto) => {
    window.electron.ipcRenderer.sendMessage('passwd:update', [
      passwdId,
      passwd,
    ]);
  };

  export const deletePasswd = (passwdId: number) => {
    window.electron.ipcRenderer.sendMessage('passwd:delete', [passwdId]);
  };

  export const exportPasswd = (userId?: number) => {
    window.electron.ipcRenderer.sendMessage('passwd:export', [userId]);
  };
}
