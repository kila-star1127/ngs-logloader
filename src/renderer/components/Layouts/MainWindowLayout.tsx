import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useWindowContext } from '../../hooks/useWindow';

export const MainWindowLayout = React.memo(({ children }) => {
  const { setBgColor } = useWindowContext();

  useEffect(() => {
    setBgColor('#3349');
  }, [setBgColor]);

  return <Layout>{children}</Layout>;
});

const Layout = styled.div`
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
  line-height: 1.25rem;
  color: #a5bebe;
  padding: 0 20px;
  text-shadow: ${() =>
    Array(4)
      .fill(null)
      .map((_, i) => `${i & 1 ? 1 : -1}px ${i & 2 ? 1 : -1}px 1px #333`)
      .join(',')};
`;
