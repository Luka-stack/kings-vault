import { app, BrowserWindow, Menu, Tray } from 'electron';

export class CustomTray extends Tray {
  constructor(
    private readonly iconPath: string,
    private readonly window: BrowserWindow
  ) {
    super(iconPath);

    this.setToolTip("King's Vault");
    this.setContextMenu(this.createContextMenu());
    this.initListeners();
  }

  initListeners = (): void => {
    this.on('double-click', () => this.window.show());
  };

  createContextMenu = (): Menu => {
    return Menu.buildFromTemplate([
      {
        label: "Open King's Vault",
        click: () => this.window.show(),
      },
      { type: 'separator' },
      {
        label: 'Exit',
        click: () => app.quit(),
      },
    ]);
  };
}
