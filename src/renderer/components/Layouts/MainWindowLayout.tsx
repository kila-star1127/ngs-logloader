import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useWindowContext } from '../../hooks/useWindow';

export const MainWindowLayout = React.memo(({ children }) => {
  const { setBgColor } = useWindowContext();

  useEffect(() => {
    setBgColor('#111');
  }, [setBgColor]);

  return <Layout>{children}</Layout>;
});

const Layout = styled.div`
  color: #acc;
  text-shadow: ${() =>
    Array(4)
      .fill(null)
      .map((_, i) => `${i & 1 ? 1 : -1}px ${i & 2 ? 1 : -1}px 1px #222`)
      .join(',')};

  border-color: gray;
`;
