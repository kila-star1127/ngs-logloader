import React from 'react';
import { Titlebar } from './Titlebar';
import styled from 'styled-components';
import { useWindowContext } from '../hooks/useWindow';

export const Window = React.memo(({ children }) => {
  const { isFocusWindow, isActiveWindow } = useWindowContext();

  return (
    <Root isFocusWindow={isFocusWindow} isActiveWindow={isActiveWindow}>
      <Titlebar />
      <Content>{children}</Content>
    </Root>
  );
});

type RootProps = {
  isFocusWindow: boolean;
  isActiveWindow: boolean;
};
const Root = styled.div<RootProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  ::before,
  ::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  ::before {
    z-index: -1;
    background-color: #3349;
    opacity: ${(p) => (p.isActiveWindow ? 1 : 0.3)};
    user-select: none;
  }
  ::after {
    opacity: ${(p) => (p.isFocusWindow ? 1 : 0.3)};
    pointer-events: none;
    border: 1px solid cyan;
    box-shadow: inset 0 0 5px -1px cyan;
  }

  color: white;
  * {
    text-shadow: ${() =>
      Array(4)
        .fill(null)
        .map((_, i) => `${i & 1 ? 1 : -1}px ${i & 2 ? 1 : -1}px 1px #333`)
        .join(',')};
  }
`;

const Content = styled.div`
  flex: 1 1 auto;
  height: 100%;
  overflow: hidden;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
  line-height: 1.25rem;
  margin: 10px;
`;
