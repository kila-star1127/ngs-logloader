import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { ipcRenderer } from 'electron';

const Home = () => {
  return (
    <>
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
    </>
  );
};

export default Home;
