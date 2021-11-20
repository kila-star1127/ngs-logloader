import { BrowserWindow, app, globalShortcut } from 'electron';
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

    await createMainWindow();

    globalShortcut.register('CommandOrControl+Shift+I', () => {
      BrowserWindow.getFocusedWindow()?.webContents.openDevTools();
    });
  })();

  app.on('window-all-closed', () => {
    app.quit();
  });
}
