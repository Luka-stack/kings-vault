import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
import { PersistentService } from './persistent-service';
import { DatabaseModule } from './database/database.module';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let databaseOld: PersistentService | null = null;
let database: DatabaseModule | null = null;
let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.platform === 'win32') {
  app.setAppUserModelId("King's Vault");
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 960,
    height: 540,
    icon: getAssetPath('crown.png'),
    resizable: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.removeMenu();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/// TODO: Extract
const createDatabase = async () => {
  const sqlFile = 'D:\\Programming\\projects\\king-vault\\.kingsvault.sqlite3';
  const appDataPath = path.join(app.getPath('userData'), '.kingsvault.sqlite3');
  console.log(appDataPath);
  databaseOld = new PersistentService(mainWindow!, sqlFile);

  // user
  ipcMain.on('user:create', (_event, args: string[]) => {
    databaseOld!.createUser(args[0], args[1], args[2]);
  });

  ipcMain.on('user:logIn', (_event, args: string[]) => {
    databaseOld!.logIn(args[0], args[1]);
  });

  ipcMain.on('user:update', (_event, args: string[]) => {
    databaseOld!.updateUser(args[0], args[1], args[2]);
  });

  ipcMain.on('user:updatePref', (_event, args: any[]) => {
    databaseOld!.uupdatePreferences(args[0], args[1], args[2]);
  });

  // passwd
  ipcMain.on('passwd:create', (_event, args: any[]) => {
    databaseOld!.createPasswd(args[0], args[1]);
  });

  ipcMain.on('passwd:findAll', (_event, args: any[]) => {
    databaseOld!.findAll(args[0].user);
  });

  ipcMain.on('passwd:findAllByModified', (_event, args: any[]) => {
    databaseOld!.findAllByModified(args[0], args[1]);
  });

  ipcMain.on('passwd:update', (_event, args: any[]) => {
    databaseOld!.updatePasswd(args[0]);
  });

  ipcMain.on('passwd:delete', (_event, args: any[]) => {
    databaseOld!.deletePasswd(args[0]);
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow().then(() => {
      // createDatabase();
      const sqlFile =
        'D:\\Programming\\projects\\king-vault\\.kingsvault.sqlite3';
      database = new DatabaseModule(sqlFile, mainWindow!);
    });
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
