import { app } from 'electron';
import { createWindow } from './helpers';
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

    const mainWindow = createWindow({
      windowName: 'main',
      options: {
        width: 1000,
        height: 600,
        show: false, // ready-to-show
      },
    });

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    if (isProd) {
      void mainWindow.loadURL('app://./index.html');
    } else {
      const [, , port] = process.argv;
      await mainWindow.loadURL(`http://localhost:${port}/`);
      mainWindow.webContents.openDevTools();
    }
  })();

  app.on('window-all-closed', () => {
    app.quit();
  });
}
