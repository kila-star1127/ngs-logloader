import { BrowserWindow, Menu } from 'electron';
import { createSettingsWindow } from '../window/settings';

type Options = { window: BrowserWindow };
export const createMenu = ({ window }: Options) => {
  const template = Menu.buildFromTemplate([
    {
      label: 'ファイル',
      submenu: [
        {
          type: 'checkbox',
          click: (menuItem, window) => window?.setAlwaysOnTop(menuItem.checked),
          label: '常に手前に表示',
        },
        {
          click: () => createSettingsWindow(),
          label: '設定',
        },
        { type: 'separator' },
        { role: 'close', label: '終了' },
      ],
    },
  ]);

  window.setMenu(template);
};
