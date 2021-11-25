import { IpcRenderer, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import Head from 'next/head';
import { PageFC } from 'next';
import styled from 'styled-components';
import { useWindowContext } from '../hooks/useWindow';

const Home: PageFC = () => {
  const [state, setState] = useState<Map<string, number>>(new Map());

  const { isActiveWindow } = useWindowContext();

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
          isActiveWindw={isActiveWindow}
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
Home.getInitialProps = () => ({ windowName: 'main' });

export default Home;

const ItemList = styled.div`
  color: #a5bebe;
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
