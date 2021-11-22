import ElectronStore from 'electron-store';

type Config = {
  alwaysOnTop: boolean;
  inactiveOpacity: number;
  clickThrough: boolean;
  logDirectoryPath: string;
};

class ConfigStore {
  private _store = new ElectronStore<Config>({
    name: 'config',
    defaults: {
      alwaysOnTop: Boolean(true),
      inactiveOpacity: 0.3,
      clickThrough: Boolean(true),
      logDirectoryPath: '%USERPROFILE%\\Documents\\SEGA\\PHANTASYSTARONLINE2\\log_ngs',
    },
  });

  get store() {
    return this._store;
  }
}

export const configStore = new ConfigStore();
