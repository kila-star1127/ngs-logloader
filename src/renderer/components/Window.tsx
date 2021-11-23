import styled, { CSSProperties } from 'styled-components';
import React from 'react';
import { Titlebar } from './Titlebar';
import { useWindowContext } from '../hooks/useWindow';

export const Window = React.memo(({ children }) => {
  const { bgColor, bgOpacity } = useWindowContext();

  return (
    <Root>
      <BG bgColor={bgColor} opacity={bgOpacity} />
      <Titlebar />
      <Content>{children}</Content>
      <Front />
    </Root>
  );
});

const Root = styled.div`
  height: 100%;
  padding: 1px;
`;

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
`;

const Content = styled.div`
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

const Front = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 1px solid cyan;
  box-shadow: inset 0 0 2px 0 cyan;
`;
