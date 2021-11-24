import { IpcRenderer, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import Head from 'next/head';
import { useWindowContext } from '../hooks/useWindow';
const Home = () => {
  const [state, setState] = useState<Map<string, number>>(new Map());

  const { isFocusWindow } = useWindowContext();

  useEffect(() => {
    const onActionPickup: Parameters<IpcRenderer['on']>[1] = (e, item: string, amount: number) => {
      console.log(item, amount);
      setState((prev) => new Map(prev.set(item, (prev.get(item) ?? 0) + amount)));
    };
    ipcRenderer.on('ActionPickup', onActionPickup);

    return () => {
      ipcRenderer.off('ActionPickup', onActionPickup);
    };
  }, []);
  return (
    <>
      <Head>
        <title>ngs-logloader</title>
      </Head>
      <Flex>
        <ItemList>
          {Array.from(state).map(([item, amount]) => (
            <div key={item}>
              {item} : {amount}
            </div>
          ))}
        </ItemList>
        <Button
          isFocusWindow={isFocusWindow}
          onClick={() => {
            ipcRenderer.send('openSettings');
          }}
        >
          ⚙ 設定
        </Button>
      </Flex>
    </>
  );
};

export default Home;

const ItemList = styled.div`
  padding: 0 10px;
  height: 100%;
  overflow-y: auto;
`;

const Flex = styled.div`
  height: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

type ButtonProps = {
  isFocusWindow: boolean;
};
const Button = styled.button<ButtonProps>`
  padding: 10px;
  color: white;
  background-color: #2f639199;
  border: 2px solid transparent;
  :hover,
  :focus {
    background-color: #2f6391ce;
    border-color: #00ffff7d;
    box-shadow: #00ffff7d inset 0 0 10px 0;
    /* box-shadow: #00ffff7d inset 0 0 1px 1px; */
    box-sizing: content-box;
  }

  ${(p) =>
    !p.isFocusWindow &&
    css`
      opacity: 0.2;
    `}
`;
