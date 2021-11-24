import { WindowName } from '../types';
import constate from 'constate';
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useState } from 'react';

type UseWindowOptions = {
  windowName: WindowName;
};
const useWindow = ({ windowName }: UseWindowOptions) => {
  const [isFocusWindow, setIsFocus] = useState(false);

  useEffect(() => {
    const onFocus = () => setIsFocus(true);
    const onBlur = () => setIsFocus(false);
    ipcRenderer.on('focus', onFocus).on('blur', onBlur);

    return () => {
      ipcRenderer.off('focus', onFocus).off('blur', onBlur);
    };
  }, []);
  return {
    isFocusWindow,
  };
};

export const [WindowProvider, useWindowContext] = constate(useWindow);
export type WindowProviderProps = UseWindowOptions;
