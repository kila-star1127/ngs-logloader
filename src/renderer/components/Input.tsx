import styled from 'styled-components';

export const Input = styled.input`
  color: white;
  user-select: none;
  /* padding: 10px; */
  background-color: #222;
  border: 2px solid gray;
  text-align: center;
  :hover,
  :focus {
    border-color: #e2b900;
    box-shadow: #e2b900 inset 0 0 3px 0;
    box-sizing: content-box;
  }
`;
