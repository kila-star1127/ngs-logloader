import './init';
import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron';
import { configStore } from './stores/config';
import { createMainWindow } from './window/main';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  void (async () => {
    await app.whenReady();

    ipcMain.handle('getConfig', (e, key) => configStore.store.get(key));
    ipcMain.handle('setConfig', (e, ...[key, value]) => {
      console.log(key, value);

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
