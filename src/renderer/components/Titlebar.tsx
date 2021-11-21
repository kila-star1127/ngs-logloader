import { IpcRenderer, ipcRenderer as ipc } from 'electron';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

const titlebarHeight = 28; // px
type ElectronEventListener = Parameters<IpcRenderer['on']>[1];

/**
 * recieve maximize
 * recieve unmaximaze
 * send maximize
 * send unmaximize
 * send minimize
 * send restore
 * send close
 *
 * @returns
 */

export const Titlebar = React.memo(() => {
  const [maximized, setMaximized] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [visible, setVisible] = useState(true);

  const ipcRenderer = ipc;

  useEffect(() => {
    const onMaximized = () => setMaximized(true);
    const onUnmaximized = () => setMaximized(false);
    const onHideTitlebar = () => setVisible(false);
    const onShowTitlebar = () => setVisible(true);
    const onPageTitleUpdated: ElectronEventListener = (_, title: string) => setTitle(title);
    ipcRenderer
      .on('maximize', onMaximized)
      .on('unmaximize', onUnmaximized)
      .on('page-title-updated', onPageTitleUpdated)
      .on('hideTitlebar', onHideTitlebar)
      .on('showTitlebar', onShowTitlebar);

    void ipcRenderer.invoke('getPageTitle').then((v: string) => setTitle(v));
    void ipcRenderer.invoke('getIsMaximazed').then((v: boolean) => setMaximized(v));

    return () => {
      ipcRenderer
        .removeListener('maximize', onMaximized)
        .removeListener('unmaximize', onUnmaximized)
        .on('page-title-upldated', onPageTitleUpdated);
    };
  }, [ipcRenderer]);

  const handleMaximize = () => {
    if (maximized) {
      ipcRenderer.send('unmaximize');
    } else {
      ipcRenderer.send('maximize');
    }
  };

  return (
    <FLTitlebarWrapper>
      {visible && (
        <FLTitlebar
          icon="/icons/icon.ico"
          title={title}
          onClose={() => ipcRenderer.send('close')}
          onMinimize={() => ipcRenderer.send('minimize')}
          onMaximize={handleMaximize}
          maximized={maximized}
        />
      )}
    </FLTitlebarWrapper>
  );
});

type FLTitlebarProps = {
  icon: string;
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  disableMinimize?: boolean;
  disableMaximize?: boolean;
  maximized: boolean;
};

const FLTitlebar = React.memo<FLTitlebarProps>((props) => {
  const {
    title,
    icon,
    onMinimize,
    onMaximize,
    onClose,
    disableMaximize,
    disableMinimize,
    maximized,
  } = props;

  const minimizeButton = (
    <button onClick={onMinimize} aria-label="minimize" title="Minimize" tabIndex={-1}>
      {minimizeSvg}
    </button>
  );

  const maixmaizeButton = (
    <button onClick={onMaximize} aria-label="maximize" title="Maximize" tabIndex={-1}>
      {maximizeSvg}
    </button>
  );

  const closeButton = (
    <button onClick={onClose} aria-label="close" title="Close" tabIndex={-1} className="close">
      {closeSvg}
    </button>
  );

  return (
    <Bar>
      {!maximized && <ResizeHandle className="top" />}
      {!maximized && <ResizeHandle className="left" />}
      <div className="icon">
        <Image layout="fill" objectFit="contain" src={icon} />
      </div>
      <Title>{title}</Title>
      <WindowControls>
        {!disableMinimize && minimizeButton}
        {!disableMaximize && maixmaizeButton}
        {closeButton}
      </WindowControls>
    </Bar>
  );
});

const FLTitlebarWrapper = styled.div`
  padding-top: ${titlebarHeight}px;
`;

const Bar = styled.div`
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  width: 100%;
  height: ${titlebarHeight}px;
  font-size: 12px;
  color: white;
  align-items: center;
  background-color: black;
  display: flex;
  > .icon {
    position: relative;
    width: ${titlebarHeight + 10}px;
    height: ${titlebarHeight - 10}px;
    /* margin: 0 10px; */
  }
  button {
    outline: none;
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  -webkit-app-region: no-drag;
  &.top {
    width: 100%;
    height: 3px;
  }
  &.left {
    width: 3px;
    height: ${titlebarHeight};
  }
`;

const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const WindowControls = styled.div`
  margin-left: auto;
  height: 100%;
  display: inline-flex;
  flex-wrap: nowrap;
  button {
    -webkit-app-region: no-drag;
    fill: currentColor;
    display: inline-block;
    border: none;
    position: relative;
    background-color: transparent;
    color: white;
    height: 100%;
    width: 44px;
    padding: 0;
    margin: 0;
    :hover {
      background-color: #fff5;
      &.close {
        background-color: red;
      }
    }
  }
`;

const Svg = React.memo<{ path?: string }>(({ path = '' }) => (
  <svg aria-hidden="true" version="1.1" width="10" height="10">
    <path d={path}></path>
  </svg>
));
const minimizeSvg = <Svg path="M 0,5 10,5 10,6 0,6 Z" />;
const maximizeSvg = <Svg path="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />;
const closeSvg = (
  <Svg path="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
);
