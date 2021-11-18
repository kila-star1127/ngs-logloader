import { BrowserWindow, app } from 'electron';
import path from 'path';
import serve from 'electron-serve';

const isProd = process.env.NODE_ENV === 'production';
if (isProd) serve({ directory: 'app' });
else app.setPath('userData', `${app.getPath('userData')} (development)`);

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./index.html');
  } else {
    const [, , port] = process.argv;
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  void app.whenReady().then(() => {
    void createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) void createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
