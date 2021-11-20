import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron';
import { configStore } from './stores/config';
import { createMainWindow } from './window/main';
import serve from 'electron-serve';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) serve({ directory: 'app' });
else app.setPath('userData', `${app.getPath('userData')} (development)`);

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  void (async () => {
    await app.whenReady();
    configStore.store.get('alwaysOnTop');

    ipcMain.handle('getConfig', (e, key) => configStore.store.get(key));
    ipcMain.handle('setConfig', (e, ...[key, value]) => {
      configStore.store.set(key, value);
    });

    await createMainWindow();

    globalShortcut.register('CommandOrControl+Shift+I', () => {
      BrowserWindow.getFocusedWindow()?.webContents.openDevTools();
    });
  })();

  app.on('window-all-closed', () => {
    app.quit();
  });
}
