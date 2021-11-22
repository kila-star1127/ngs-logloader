import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useWindowContext } from '../../hooks/useWindow';

export const MainWindowLayout = React.memo(({ children }) => {
  const { setBgColor } = useWindowContext();

  useEffect(() => {
    setBgColor('black');
  }, [setBgColor]);

  return <Layout>{children}</Layout>;
});

const Layout = styled.div`
  color: white;
`;
