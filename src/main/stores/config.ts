import ElectronStore from 'electron-store';

type Config = {
  alwaysOnTop: boolean;
  clickThrough: boolean;
  logDirectoryPath: string;
};

class ConfigStore {
  private _store = new ElectronStore<Config>({
    name: 'config',
    defaults: {
      alwaysOnTop: Boolean(true),
      clickThrough: Boolean(true),
      logDirectoryPath: '%USERPROFILE%\\Documents\\SEGA\\PHANTASYSTARONLINE2\\log_ngs',
    },
  });

  get store() {
    return this._store;
  }
}

export const configStore = new ConfigStore();
