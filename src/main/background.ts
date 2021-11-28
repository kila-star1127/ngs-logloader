import './init';
import { BrowserWindow, Menu, app, globalShortcut, ipcMain } from 'electron';
import { configStore } from './stores/config';
import { createMainWindow } from './window/main';
import { showSettingsWindow } from './window/settings';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  void (async () => {
    await app.whenReady();

    ipcMain.handle('getConfig', (e, key) => configStore.store.get(key));
    ipcMain.handle('setConfig', (e, ...[key, value]) => configStore.store.set(key, value));

    ipcMain.handle('getPageTitle', (e) => BrowserWindow.fromId(e.sender.id)?.title);
    ipcMain.handle('getIsMaximazed', (e) => BrowserWindow.fromId(e.sender.id)?.isMaximized());

    ipcMain
      .on('maximize', (e) => BrowserWindow.fromId(e.sender.id)?.maximize())
      .on('unmaximize', (e) => BrowserWindow.fromId(e.sender.id)?.unmaximize())
      .on('minimize', (e) => BrowserWindow.fromId(e.sender.id)?.minimize())
      .on('restore', (e) => BrowserWindow.fromId(e.sender.id)?.restore())
      .on('close', (e) => BrowserWindow.fromId(e.sender.id)?.close());

    ipcMain.on('openSettings', () => void showSettingsWindow());

    await createMainWindow();

    void Menu.setApplicationMenu(null);

    globalShortcut.register('CommandOrControl+Shift+I', () => {
      BrowserWindow.getFocusedWindow()?.webContents.openDevTools();
    });
  })();

  app.on('window-all-closed', () => {
    app.quit();
  });
}
