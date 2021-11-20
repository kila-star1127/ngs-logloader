import { BrowserWindow, ipcMain } from 'electron';
import { configStore } from '../stores/config';
import { createWindow } from '../helpers';

let settingsWindow: BrowserWindow | undefined;

const createSettingsWindow = async () => {
  const window = await createWindow({
    windowName: 'settings',
    loadPath: '/settings',
    options: { width: 800, height: 600 },
  });

  window.removeMenu();

  settingsWindow = window;
  window.on('closed', () => (settingsWindow = undefined));

  ipcMain.handle('getConfig', (e, key) => configStore.store.get(key));
  ipcMain.handle('setConfig', (e, ...[key, value]) => {
    configStore.store.set(key, value);
  });

  return window;
};

export const showSettingsWindow = async () => {
  if (settingsWindow) {
    settingsWindow.moveTop();
    return settingsWindow;
  }

  return createSettingsWindow();
};
