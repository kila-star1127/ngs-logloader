import { IpcRenderer, ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { CSSProperties } from 'styled-components';
import { Window } from '../components/Window';
import constate from 'constate';
import { useState } from 'react';

type ElectronEventListener = Parameters<IpcRenderer['on']>[1];

const useWindow = () => {
  const [bgColor, setBgColor] = useState<CSSProperties['backgroundColor']>('white');
  const [bgOpacity, setBgOpacity] = useState<CSSProperties['opacity']>(1);

  useEffect(() => {
    const onSetBgOpacity: ElectronEventListener = (_, title: string) => setBgOpacity(title);
    ipcRenderer.on('setBgOpacity', onSetBgOpacity);

    return () => {
      ipcRenderer.off('setBgOpacity', onSetBgOpacity);
    };
  }, []);
  return {
    setBgColor,
    bgColor,
    setBgOpacity,
    bgOpacity,
  };
};

const [Provider, useWindowContext] = constate(useWindow);

export { useWindowContext };
export const WindowProvider = React.memo(({ children }) => {
  return (
    <Provider>
      <Window>{children}</Window>
    </Provider>
  );
});
