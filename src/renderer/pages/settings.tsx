import React, { useCallback, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import Head from 'next/head';
import { Input } from '../components/Input';
import { PageFC } from 'next';
import { ipcRenderer } from 'electron';
import { useWindowContext } from '../hooks/useWindow';

const Settings: PageFC = () => {
  const { isActiveWindow } = useWindowContext();

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
        <Input type="number" ref={inactiveOpacityInputRef} min="0.1" max="0.7" step="0.1" />
      </div>
      <div>
        クリックスルー
        <Input type="checkbox" ref={clickThroughInputRef} />
      </div>
      <hr />
      <Button isActiveWindw={isActiveWindow} onClick={onClickSave}>
        設定を保存
      </Button>
    </>
  );
};
Settings.getInitialProps = () => ({ windowName: 'settings' });

export default Settings;
