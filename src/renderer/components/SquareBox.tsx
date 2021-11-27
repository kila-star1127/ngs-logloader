import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

type SquareBox = PropsWithChildren<{
  size: number;
}>;
export const SquareBox = React.memo<SquareBox>(({ children, size }) => {
  return (
    <Styled size={size}>
      <div>
        <div>{children}</div>
      </div>
    </Styled>
  );
});

type StyledProps = {
  size: number;
};
const Styled = styled.div<StyledProps>`
  width: ${(p) => `${p.size}px`};
  height: ${(p) => `${p.size}px`};
  > div {
    position: relative;
    padding-top: 100%;
    padding-left: 100%;

    > div {
      position: absolute;
      overflow: hidden;
      inset: 0;
    }
  }
`;
