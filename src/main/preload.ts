import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import { AES256Decryption } from './cipher';

export type Channels =
  | 'user:create'
  | 'user:logIn'
  | 'user:update'
  | 'user:updatePref'
  | 'passwd:create'
  | 'passwd:update'
  | 'passwd:delete'
  | 'passwd:findAll'
  | 'passwd:export'
  | 'passwd:import'
  | 'control:restore';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const oldListeners = ipcRenderer.listeners(channel);
      if (oldListeners.length > 0) {
        return;
      }

      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

contextBridge.exposeInMainWorld('cipher', {
  decrypt: AES256Decryption,
});
