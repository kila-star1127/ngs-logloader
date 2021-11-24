import { AppPageProps } from 'next/app';
import React from 'react';
import { Window } from '../components/Window';
import { WindowProvider } from '../hooks/useWindow';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const App: React.FC<AppPageProps> = ({ Component, pageProps }) => {
  const { windowName } = pageProps;
  console.log(windowName);

  return (
    <>
      <GlobalStyle />
      <WindowProvider windowName={windowName}>
        <Window>
          <Component {...pageProps} />
        </Window>
      </WindowProvider>
    </>
  );
};

export default App;

const GlobalStyle = createGlobalStyle`
${reset}
  body,
  html {
    overflow: hidden;
    height: 100%;
    
  }
  #__next {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  *, ::before, ::after {
    box-sizing: border-box;
  }
  button {
    border: none;
    outline: none;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    backdrop-filter: blur(5px);
    background-color: #9994;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: #cccccc;
  }
  
  ::-webkit-scrollbar-button{
    background-color: #7a8287;
    height: 4px;
  }
`;
