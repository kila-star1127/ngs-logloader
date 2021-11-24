import { WindowName } from '../types';

type WindowConfig = {
  inactiveWithBlur?: boolean;
};
export const WindowConfigs: Record<WindowName, WindowConfig> = {
  main: {
    inactiveWithBlur: true,
  },
  settings: {
    inactiveWithBlur: false,
  },
};
