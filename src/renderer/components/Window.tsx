import styled, { CSSProperties } from 'styled-components';
import React from 'react';
import { Titlebar } from './Titlebar';
import { useWindowContext } from '../hooks/useWindow';

export const Window = React.memo(({ children }) => {
  const { backgroundColor } = useWindowContext();
  return (
    <StyledWindow backgroundColor={backgroundColor}>
      <Titlebar />
      {children}
    </StyledWindow>
  );
});

type StyledWindowProps = {
  backgroundColor: CSSProperties['backgroundColor'];
};
const StyledWindow = styled.div<StyledWindowProps>`
  inset: 0;
  background-color: ${(p) => p.backgroundColor};
  height: 100%;
`;
