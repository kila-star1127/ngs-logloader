import React, { useEffect } from 'react';
import { useWindowContext } from '../../hooks/useWindow';

export const MainWindowLayout = React.memo(({ children }) => {
  const { setBackgroundColor } = useWindowContext();

  useEffect(() => {
    setBackgroundColor('black');
  }, [setBackgroundColor]);

  return <>{children}</>;
});
