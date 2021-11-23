import styled, { CSSProperties } from 'styled-components';
import React from 'react';
import { Titlebar } from './Titlebar';
import { useWindowContext } from '../hooks/useWindow';

export const Window = React.memo(({ children }) => {
  const { bgColor, bgOpacity } = useWindowContext();
  return (
    <>
      <BG bgColor={bgColor} opacity={bgOpacity} />
      <Titlebar />
      <Content>{children}</Content>
    </>
  );
});

type BGProps = {
  bgColor: CSSProperties['backgroundColor'];
  opacity: CSSProperties['opacity'];
};
const BG = styled.div<BGProps>`
  inset: 0;
  z-index: -1;
  position: absolute;
  background-color: ${(p) => p.bgColor};
  opacity: ${(p) => p.opacity};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid cyan;
  box-shadow: inset 0 0 2px 0 cyan;
`;

const Content = styled.div``;
