import { app } from 'electron';
import { createMenu } from '../helpers/create-menu';
import { createWindow } from '../helpers';

export const createMainWindow = async () => {
  const mainWindow = await createWindow({
    windowName: 'main',
    loadPath: '/main',
    options: {
      width: 1000,
      height: 600,
    },
  });

  createMenu({ window: mainWindow });

  mainWindow.on('closed', () => app.quit());

  return mainWindow;
};
