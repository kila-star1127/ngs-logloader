import styled from 'styled-components';

export const TextInput = styled.input`
  height: 100%;
  width: 100%;
  color: white;
  user-select: none;
  background-color: #222;
  border: 2px solid gray;
  text-align: left;
  padding-left: 10px;
  :hover,
  :focus {
    border-color: #e2b900;
    box-shadow: #e2b900 inset 0 0 3px 0;
  }
`;
