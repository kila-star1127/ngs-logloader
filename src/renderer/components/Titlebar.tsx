import { IpcRenderer, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useWindowContext } from '../hooks/useWindow';

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

  const { isFocusWindow } = useWindowContext();

  useEffect(() => {
    const onMaximized = () => setMaximized(true);
    const onUnmaximized = () => setMaximized(false);
    const onPageTitleUpdated: ElectronEventListener = (_, title: string) => setTitle(title);
    ipcRenderer
      .on('maximize', onMaximized)
      .on('unmaximize', onUnmaximized)
      .on('page-title-updated', onPageTitleUpdated);

    void ipcRenderer.invoke('getPageTitle').then((v: string) => setTitle(v));
    void ipcRenderer.invoke('getIsMaximazed').then((v: boolean) => setMaximized(v));

    return () => {
      ipcRenderer
        .off('maximize', onMaximized)
        .off('unmaximize', onUnmaximized)
        .off('page-title-upldated', onPageTitleUpdated);
    };
  }, []);

  const handleMaximize = () => {
    if (maximized) {
      ipcRenderer.send('unmaximize');
    } else {
      ipcRenderer.send('maximize');
    }
  };

  if (!isFocusWindow) return <></>;

  return (
    <FLTitlebar
      icon="/icons/icon.ico"
      title={title}
      onClose={() => ipcRenderer.send('close')}
      onMinimize={() => ipcRenderer.send('minimize')}
      onMaximize={handleMaximize}
      maximized={maximized}
    />
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
    // maximized,
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
      <Icon src={icon} />
      <Title>{title}</Title>
      <WindowControls>
        {!disableMinimize && minimizeButton}
        {!disableMaximize && maixmaizeButton}
        {closeButton}
      </WindowControls>
    </Bar>
  );
});
const anim = keyframes`
 ${Array(10)
   .fill(null)
   .map(() => {
     return css`
       ${100 * Math.random()}% {
         opacity: ${0.5 + Math.random() * 0.4};
         filter: blur(${0.5 + Math.random() * 0.5}px);
       }
     `;
   })}
   from {
    opacity: 0.5;
    filter: blur(0.5px);
   }
   to {
    opacity: 0.5;
    filter: blur(0.5px);
   }
`;

const Bar = styled.div`
  -webkit-app-region: drag;
  inset: 0;
  width: 100%;
  height: 35px;
  font-size: 12px;
  color: white;
  align-items: center;
  display: flex;
  position: relative;
  background-color: #306796;

  > * {
    z-index: 1;
  }

  button {
    outline: none;
  }

  ::before {
    content: '';
    z-index: 0;
    animation: 3s ${anim} infinite alternate;
    position: absolute;
    width: 100%;
    height: 100%;
    mask-image: linear-gradient(45deg, black, transparent 20% 80%, black);
    background: 0 0 / 5px 5px radial-gradient(circle 3px, #67ffff 40%, transparent 40%);
    background-repeat: space;
  }
`;

const Icon = styled.img`
  height: 100%;
  padding: 5px;
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
