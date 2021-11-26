import styled, { css } from 'styled-components';

type ButtonProps = {
  isActiveWindw: boolean;
};
export const Button = styled.div<ButtonProps>`
  user-select: none;
  padding: 10px;
  background-color: #2f639199;
  border: 2px solid transparent;
  text-align: center;
  :hover,
  :focus {
    background-color: #2f6391ce;
    border-color: #00ffff7d;
    box-shadow: #00ffff7d inset 0 0 10px 0;
  }

  ${(p) =>
    !p.isActiveWindw &&
    css`
      opacity: 0.2;
    `}
`;
