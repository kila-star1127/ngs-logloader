import { WindowConfigs } from '../constants/window';
import { WindowName } from '../types';
import constate from 'constate';
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useState } from 'react';

type UseWindowOptions = {
  windowName: WindowName;
};
const useWindow = ({ windowName }: UseWindowOptions) => {
  const inactiveWithBlur = WindowConfigs[windowName]?.inactiveWithBlur;

  const [isFocusWindow, setIsFocus] = useState(false);
  const [isActiveWindow, setIsActive] = useState(inactiveWithBlur ? isFocusWindow : true);

  useEffect(() => {
    const onFocus = () => setIsFocus(true);
    const onBlur = () => setIsFocus(false);
    ipcRenderer.on('focus', onFocus).on('blur', onBlur);

    return () => {
      ipcRenderer.off('focus', onFocus).off('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    if (inactiveWithBlur) setIsActive(isFocusWindow);
  }, [inactiveWithBlur, isFocusWindow]);

  return {
    isFocusWindow,
    isActiveWindow,
  };
};

export const [WindowProvider, useWindowContext] = constate(useWindow);
