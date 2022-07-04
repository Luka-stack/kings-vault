import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { CustomTray } from './custom-tray';
import { resolveHtmlPath } from './util';

export class MainWindow extends BrowserWindow {
  private _tray: CustomTray | null = null;

  constructor(private readonly iconPath: string) {
    super({
      show: false,
      width: 960,
      height: 540,
      icon: iconPath,
      resizable: false,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
    });

    this.removeMenu();
    this.loadURL(resolveHtmlPath('index.html'));
    this.initListeners();

    this.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });
  }

  initListeners = () => {
    this.on('ready-to-show', () => {
      this.show();
    });

    this.on('minimize', (event: Electron.Event) => {
      event.preventDefault();
      this.hide();
      this._tray = new CustomTray(this.iconPath, this);
    });

    this.on('restore', (event: Electron.Event) => {
      event.preventDefault();
      this.show();
      this._tray?.destroy();
      this._tray = null;
    });
  };
}
