import React, { useEffect } from 'react';
import { Window } from '../components/Window';
import constate from 'constate';
import { ipcRenderer } from 'electron';
import { useState } from 'react';

const useWindow = () => {
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

const [Provider, useWindowContext] = constate(useWindow);

export { useWindowContext };
export const WindowProvider = React.memo(({ children }) => {
  return (
    <Provider>
      <Window>{children}</Window>
    </Provider>
  );
});
