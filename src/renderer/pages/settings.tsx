import { Flex, FlexItem } from '../components/Flex';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import Head from 'next/head';
import { ItemNameFilter } from '../components/ItemNameFilter';
import { PageFC } from 'next';
import { ipcRenderer } from 'electron';

const Settings: PageFC = () => {
  const alwaysOnTopInputRef = useRef<HTMLInputElement>(null);
  const clickThroughInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilter] = useState<string[]>([]);

  const savingRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const getConfig = useCallback(async () => {
    await Promise.all([
      ipcRenderer.invoke('getConfig', 'alwaysOnTop').then((v: boolean) => {
        const current = alwaysOnTopInputRef.current;
        if (current) current.checked = v;
      }),
      ipcRenderer.invoke('getConfig', 'clickThrough').then((v: boolean) => {
        const current = clickThroughInputRef.current;
        if (current) current.checked = v;
      }),
      ipcRenderer.invoke('getConfig', 'filters').then((v: { whitelist: string[] }) => {
        console.log(v);

        setFilter(v.whitelist.length ? v.whitelist : ['']);
      }),
    ]);
  }, []);

  useEffect(() => void getConfig().then(() => setIsInitialized(true)), [getConfig]);

  const onClickSave = useCallback(() => {
    if (savingRef.current) return;

    savingRef.current = true;

    const alwaysOnTop = alwaysOnTopInputRef.current?.checked;
    const clickThrough = clickThroughInputRef.current?.checked;

    void Promise.all([
      alwaysOnTop != null && ipcRenderer.invoke('setConfig', 'alwaysOnTop', alwaysOnTop),
      clickThrough != null && ipcRenderer.invoke('setConfig', 'clickThrough', clickThrough),
      ipcRenderer.invoke(
        'setConfig',
        'filters',
        filters.reduce<{ whitelist: string[]; ignore: string[] }>(
          (acc, filter) => {
            if (filter) acc.whitelist.push(filter);

            return acc;
          },
          { whitelist: [], ignore: [] },
        ),
      ),
    ]).finally(() => {
      savingRef.current = false;
    });
  }, [filters]);

  return (
    <>
      <Head>
        <title>Settings - ngs-logloader</title>
      </Head>

      <Flex direction="column" gap="10px">
        <FlexItem grow={1} scrollable>
          <div>
            常に手前に表示
            <input type="checkbox" ref={alwaysOnTopInputRef} />
          </div>
          <div>
            クリックスルー
            <input type="checkbox" ref={clickThroughInputRef} />
          </div>
          <hr />
          <div>アイテム名フィルタ</div>
          {isInitialized && (
            <ItemNameFilter filters={filters} onChange={(filter) => setFilter(filter)} />
          )}
        </FlexItem>
        <FlexItem>
          <Button onClick={onClickSave}>設定を保存</Button>
        </FlexItem>
      </Flex>
    </>
  );
};
Settings.getInitialProps = () => ({ windowName: 'settings' });

export default Settings;
