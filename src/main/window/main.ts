import { NgsLog } from '../helpers/ngs-log';
import { app } from 'electron';
import { configStore } from '../stores/config';
import { createWindow } from '../helpers';

export const createMainWindow = async () => {
  const config = configStore.store;
  const mainWindow = await createWindow({
    windowName: 'main',
    loadPath: '/main',
    showInactive: true,
    options: {
      width: 1000,
      height: 600,
      alwaysOnTop: config.get('alwaysOnTop'),
      frame: false,
    },
  });

  config.onDidAnyChange((newConfig) => {
    if (!newConfig) return;

    const { alwaysOnTop, clickThrough } = newConfig;
    mainWindow.setAlwaysOnTop(alwaysOnTop);
    if (!mainWindow.isFocused()) {
      mainWindow.setIgnoreMouseEvents(alwaysOnTop && clickThrough);
    }
  });
  config.onDidChange('filters', (newValue) => {
    if (!newValue) return;

    mainWindow.webContents.send('UpdateFilter', newValue.whitelist);
  });
  mainWindow
    .on('blur', () => {
      const alwaysOnTop = config.get('alwaysOnTop');
      mainWindow.setIgnoreMouseEvents(alwaysOnTop && config.get('clickThrough'));
      mainWindow.webContents.send('blur');
    })
    .on('focus', () => {
      mainWindow.setIgnoreMouseEvents(false);
      mainWindow.setOpacity(1);
      mainWindow.webContents.send('focus');
    });

  mainWindow.on('closed', () => {
    app.quit();
  });

  const log = new NgsLog({
    logDirectoryPath: config.get('logDirectoryPath'),
  });

  log.on('line', (item, amount) => {
    console.log(item, amount);

    const { whitelist } = config.get('filters');
    const match = !whitelist.length || whitelist.some((filter) => ~item.indexOf(filter));

    if (match) mainWindow.webContents.send('ActionPickup', item, amount);
  });

  log.watch();

  return mainWindow;
};
