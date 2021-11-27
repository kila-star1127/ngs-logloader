import React, { useCallback, useEffect, useRef } from 'react';
import styled, { CSSObject, css } from 'styled-components';
import { Button } from '../components/Button';
import Head from 'next/head';
import { PageFC } from 'next';
import { SquareBox } from '../components/SquareBox';
import { TextInput } from '../components/Input';
import { ipcRenderer } from 'electron';

const Settings: PageFC = () => {
  const alwaysOnTopInputRef = useRef<HTMLInputElement>(null);
  const clickThroughInputRef = useRef<HTMLInputElement>(null);

  const savingRef = useRef(false);

  const getConfig = useCallback(() => {
    void ipcRenderer.invoke('getConfig', 'alwaysOnTop').then((v: boolean) => {
      const current = alwaysOnTopInputRef.current;
      if (current) current.checked = v;
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
    const clickThrough = clickThroughInputRef.current?.checked;

    void Promise.all([
      alwaysOnTop != null && ipcRenderer.invoke('setConfig', 'alwaysOnTop', alwaysOnTop),
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
      <Flex direction="column">
        <FlexItem grow={1}>
          <div>
            常に手前に表示
            <input type="checkbox" ref={alwaysOnTopInputRef} />
          </div>
          <div>
            クリックスルー
            <input type="checkbox" ref={clickThroughInputRef} />
          </div>
          <hr />
          <div>
            アイテム名フィルタ
            <Flex direction="column">
              {Array(2)
                .fill(null)
                .map((_, k) => (
                  <FlexItem key={k}>
                    <Flex>
                      <FlexItem grow={1}>
                        <TextInput type="text" ref={clickThroughInputRef} />
                      </FlexItem>
                      <FlexItem>
                        <SquareBox size={40}>
                          <Button>-</Button>
                        </SquareBox>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                ))}
              <FlexItem align="end">
                <SquareBox size={40}>
                  <Button>+</Button>
                </SquareBox>
              </FlexItem>
            </Flex>
          </div>
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

type FlexItemProps = {
  basis?: CSSObject['flexBasis'];
  grow?: CSSObject['flexGrow'];
  shrink?: CSSObject['flexShrink'];
  flex?: CSSObject['flex'];
  order?: CSSObject['order'];
  align?: CSSObject['alignSelf'];
};
const FlexItem = styled.div<FlexItemProps>`
  ${(p) => css`
    flex-basis: ${p.basis};
    flex-grow: ${p.grow};
    flex-shrink: ${p.shrink};
    order: ${p.order};
    align-self: ${p.align};
  `}
`;

type FlexProps = {
  direction?: CSSObject['flexDirection'];
  alignItems?: CSSObject['alignItems'];
  alignContent?: CSSObject['alignContent'];
  height?: CSSObject['height'];
};
const Flex = styled.div<FlexProps>`
  display: flex;
  width: 100%;
  flex-direction: ${(p) => p.direction};
  gap: 10px;
  height: ${(p) => p.height ?? '100%'};
`;
