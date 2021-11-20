import {
  BrowserWindow,
  BrowserWindowConstructorOptions as WindowOptions,
  app,
  screen,
} from 'electron';
import Store from 'electron-store';
import pick from 'object.pick';

type WindowState = Pick<WindowOptions, 'x' | 'y' | 'width' | 'height'>;
const WindowStateTypeProps: readonly (keyof WindowState)[] = ['x', 'y', 'width', 'height'];

let store: Store<Record<string, WindowState>> | undefined;

app.on('ready', () => {
  store = new Store<Record<string, WindowState>>({
    name: 'window-state',
  });
});

const getWindowStateStoreKey = (windowName: string) => {
  const key = `window-${windowName}`;
  return key;
};

const windowWithinBounds = (_windowState: WindowState, bounds: Electron.Rectangle) => {
  const windowState: Required<WindowState> = { x: 0, y: 0, width: 0, height: 0, ..._windowState };

  return (
    windowState.x >= bounds.x &&
    windowState.y >= bounds.y &&
    windowState.x + windowState.width <= bounds.x + bounds.width &&
    windowState.y + windowState.height <= bounds.y + bounds.height
  );
};

const createWindowOptions = (options: WindowOptions): WindowOptions => ({
  ...options,
  show: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    ...options.webPreferences,
  },
});

export type CreateWindowOptions = {
  windowName?: string;
  loadPath?: string;
  options?: WindowOptions;
};

export const createWindow = async ({ windowName, loadPath, options }: CreateWindowOptions) => {
  let windowState: WindowState = {};

  if (windowName) {
    const defaultSize: Partial<WindowState> = { ...options };

    const ensureVisibleOnSomeDisplay = (windowState: WindowState) => {
      const visible = screen.getAllDisplays().some((display) => {
        return windowWithinBounds(windowState, display.bounds);
      });
      if (!visible) {
        // Window is partially or fully not visible now.
        // Reset it to safe defaults.
        const bounds = screen.getPrimaryDisplay().bounds;
        return Object.assign({}, defaultSize, {
          x: (bounds.width - (defaultSize.width ?? 0)) / 2,
          y: (bounds.height - (defaultSize.height ?? 0)) / 2,
        });
      }
      return windowState;
    };

    if (store) {
      const restore = store.get(getWindowStateStoreKey(windowName), defaultSize);
      windowState = ensureVisibleOnSomeDisplay(restore);
    }
  }

  const win = new BrowserWindow(
    createWindowOptions({
      ...options,
      ...windowState,
    }),
  );

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  if (windowName) {
    win.on('close', () => {
      const key = getWindowStateStoreKey(windowName);
      if (!win.isMinimized() && !win.isMaximized()) {
        Object.assign(windowState, getCurrentPosition());
      }
      store?.set(key, pick(windowState, WindowStateTypeProps));
    });
  }

  win.on('page-title-updated', (_, title) => win.webContents.send('page-title-updated', title));

  if (options?.show || options?.show === undefined) {
    win.once('ready-to-show', () => {
      win.show();
    });
  }

  if (loadPath) {
    if (process.env.NODE_ENV === 'production') {
      await win.loadURL(`app://./${loadPath}.html`);
    } else {
      const [, , port] = process.argv;
      await win.loadURL(`http://localhost:${port}/${loadPath}`);
    }
  }

  return win;
};
