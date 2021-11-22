import { IpcRenderer, ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MainWindowLayout } from '../components/Layouts/MainWindowLayout';
const Home = () => {
  useEffect(() => {
    const onActionPickup: Parameters<IpcRenderer['on']>[1] = (e, item: string, amount: number) => {
      console.log(item, amount);
    };
    ipcRenderer.on('ActionPickup', onActionPickup);

    return () => {
      ipcRenderer.off('ActionPickup', onActionPickup);
    };
  }, []);
  return (
    <MainWindowLayout>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">
            <a>Go to next page</a>
          </Link>
        </p>
        <img src="/images/logo.png" />
      </div>
      <button
        onClick={() => {
          ipcRenderer.send('openSettings');
        }}
      >
        a
      </button>
    </MainWindowLayout>
  );
};

export default Home;
