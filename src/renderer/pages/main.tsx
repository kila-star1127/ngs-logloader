import { IpcRenderer, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
const Home = () => {
  const [state, setState] = useState<Map<string, number>>(new Map());

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
      {Array.from(state).map(([item, amount]) => (
        <div key={item}>
          {item} : {amount}
        </div>
      ))}
      <button
        onClick={() => {
          ipcRenderer.send('openSettings');
        }}
      >
        ⚙ 設定
      </button>
    </>
  );
};

export default Home;
