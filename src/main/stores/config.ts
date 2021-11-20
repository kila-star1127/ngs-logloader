import ElectronStore from 'electron-store';

type Config = {
  alwaysOnTop: boolean;
  inactiveOpacity: number;
  clickThrough: boolean;
};

class ConfigStore {
  private _store = new ElectronStore<Config>({
    name: 'config',
    defaults: {
      alwaysOnTop: Boolean(true),
      inactiveOpacity: 0.5,
      clickThrough: Boolean(true),
    },
  });

  get store() {
    return this._store;
  }
}

export const configStore = new ConfigStore();
