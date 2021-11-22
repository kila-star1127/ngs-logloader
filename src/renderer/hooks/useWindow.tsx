import { CSSProperties } from 'styled-components';
import React from 'react';
import { Window } from '../components/Window';
import constate from 'constate';
import { useState } from 'react';

const useWindow = () => {
  const [backgroundColor, setBackgroundColor] = useState<CSSProperties['backgroundColor']>('white');

  return {
    setBackgroundColor,
    backgroundColor,
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
