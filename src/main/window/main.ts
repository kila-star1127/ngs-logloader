import { NgsLog } from '../helpers/ngs-log';
import { app } from 'electron';
import { configStore } from '../stores/config';
import { createWindow } from '../helpers';

export const createMainWindow = async () => {
  const config = configStore.store;
  const mainWindow = await createWindow({
    windowName: 'main',
    loadPath: '/main',
    options: {
      width: 1000,
      height: 600,
      alwaysOnTop: config.get('alwaysOnTop'),
      frame: false,
    },
  });

  config.onDidAnyChange((newConfig) => {
    if (!newConfig) return;
    const { alwaysOnTop, clickThrough, inactiveOpacity } = newConfig;
    mainWindow.setAlwaysOnTop(alwaysOnTop);
    if (!mainWindow.isFocused()) {
      mainWindow.setIgnoreMouseEvents(alwaysOnTop && clickThrough);
      mainWindow.setOpacity(inactiveOpacity);
    }
  });
  mainWindow
    .on('blur', () => {
      const alwaysOnTop = config.get('alwaysOnTop');
      mainWindow.setIgnoreMouseEvents(alwaysOnTop && config.get('clickThrough'));
      mainWindow.setOpacity(config.get('inactiveOpacity'));
      mainWindow.webContents.send('hideTitlebar');
    })
    .on('focus', () => {
      mainWindow.setIgnoreMouseEvents(false);
      mainWindow.setOpacity(1);
      mainWindow.webContents.send('showTitlebar');
    });

  mainWindow.on('closed', () => {
    app.quit();
  });

  const log = new NgsLog({
    logDirectoryPath: config.get('logDirectoryPath'),
  });

  log.on('line', (item, amount) => {
    console.log(item, amount);
  });

  return mainWindow;
};
