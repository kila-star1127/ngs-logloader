import { AppProps } from 'next/app';
import React from 'react';
import { WindowProvider } from '../hooks/useWindow';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <WindowProvider>
        <Component {...pageProps} />
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
  * {
    box-sizing: border-box;
  }
`;
