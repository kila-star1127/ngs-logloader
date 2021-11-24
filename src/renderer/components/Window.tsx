import React from 'react';
import { Titlebar } from './Titlebar';
import styled from 'styled-components';
import { useWindowContext } from '../hooks/useWindow';

export const Window = React.memo(({ children }) => {
  const { isFocusWindow } = useWindowContext();

  return (
    <Root isFocusWindow={isFocusWindow}>
      <Titlebar />
      <Content>{children}</Content>
    </Root>
  );
});

type RootProps = {
  isFocusWindow: boolean;
};
const Root = styled.div<RootProps>`
  height: 100%;
  padding: 1px;
  ::before,
  ::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: ${(p) => (p.isFocusWindow ? 1 : 0.3)};
  }
  ::before {
    z-index: -1;
    background-color: #3349;
  }
  ::after {
    pointer-events: none;
    border: 1px solid cyan;
    box-shadow: inset 0 0 5px -1px cyan;
  }
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

const Front = styled.div``;
