import { IpcRenderer, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Button } from '../components/Button';
import Head from 'next/head';
import { PageFC } from 'next';

const Home: PageFC = () => {
  const [state, setState] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const onActionPickup: Parameters<IpcRenderer['on']>[1] = (e, item: string, amount: number) => {
      console.log(item, amount);

      const match = !!item.match('C/');

      if (match) {
        setState((prev) => new Map(prev.set(item, (prev.get(item) ?? 0) + amount)));
      }
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
          {[...state.keys()].map((item) => {
            const amount = state.get(item);
            if (amount == null) return;

            return (
              <Item key={`${item}-${amount}`}>
                {item} : {amount}
              </Item>
            );
          })}
        </ItemList>
        <div>
          <Flex direction="row">
            <Button
              onClick={() => {
                setState(new Map());
              }}
            >
              RESET
            </Button>
            <Button
              onClick={() => {
                ipcRenderer.send('openSettings');
                console.log('click');
              }}
            >
              ⚙ 設定
            </Button>
          </Flex>
        </div>
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

const Flex = styled.div<{ direction?: 'column' | 'row' }>`
  ${(p) =>
    p.direction != 'row' &&
    css`
      height: 100%;
    `}

  > * {
    width: 100%;
  }
  display: flex;
  gap: 10px;
  flex-direction: ${(p) => p.direction ?? 'column'};
`;

const updateAnim = keyframes`
    from {
      color: #ffa500;
    }
    to {
      color: none;
    }
`;

const Item = styled.div`
  animation: 5s cubic-bezier(1, 0.29, 1, -0.16) ${updateAnim};
`;
