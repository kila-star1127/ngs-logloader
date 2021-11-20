import React, { useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { ipcRenderer } from 'electron';

const Home = () => {
  const alwaysOnTopInputRef = useRef<HTMLInputElement>(null);
  const clickThroughInputRef = useRef<HTMLInputElement>(null);
  const inactiveOpacityInputRef = useRef<HTMLInputElement>(null);

  const savingRef = useRef(false);

  const getConfig = useCallback(() => {
    void ipcRenderer.invoke('getConfig', 'alwaysOnTop').then((v: boolean) => {
      const current = alwaysOnTopInputRef.current;
      if (current) current.checked = v;
    });
    void ipcRenderer.invoke('getConfig', 'inactiveOpacity').then((v: number) => {
      const current = inactiveOpacityInputRef.current;
      if (current) current.valueAsNumber = v;
    });
    void ipcRenderer.invoke('getConfig', 'clickThrough').then((v: boolean) => {
      const current = clickThroughInputRef.current;
      if (current) current.checked = v;
    });
  }, []);

  useEffect(() => getConfig(), [getConfig]);

  const onClickSave = useCallback(() => {
    if (savingRef.current) return;

    savingRef.current = true;

    const alwaysOnTop = alwaysOnTopInputRef.current?.checked;
    const inactiveOpacity = inactiveOpacityInputRef.current?.valueAsNumber;
    const clickThrough = clickThroughInputRef.current?.checked;

    void Promise.all([
      alwaysOnTop != null && ipcRenderer.invoke('setConfig', 'alwaysOnTop', alwaysOnTop),
      inactiveOpacity != null &&
        ipcRenderer.invoke('setConfig', 'inactiveOpacity', inactiveOpacity),
      clickThrough != null && ipcRenderer.invoke('setConfig', 'clickThrough', clickThrough),
    ]).finally(() => {
      savingRef.current = false;
    });
  }, []);

  return (
    <>
      <Head>
        <title>Settings - ngs-logloader</title>
      </Head>
      <div>
        常に手前に表示
        <input type="checkbox" ref={alwaysOnTopInputRef} />
      </div>
      <div>
        非アクティブ時の不透明度
        <input type="number" ref={inactiveOpacityInputRef} min="0.1" max="1" step="00.1" />
      </div>
      <div>
        クリックスルー
        <input type="checkbox" ref={clickThroughInputRef} />
      </div>
      <hr />
      <button onClick={onClickSave}>設定を保存</button>
    </>
  );
};

export default Home;
