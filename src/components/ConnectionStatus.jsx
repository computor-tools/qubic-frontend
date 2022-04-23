import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ConnectionContext } from './ConnectionProvider';
import styled, { keyframes } from 'styled-components';

const ConnectingAnimation = keyframes`
  50% {
    transform: scale(1.4);
  }
`;

const Indicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  margin-left: 1vw;
  background-color: ${function (props) {
    return props.backgroundColor;
  }};
  transition: background-color 0.5s;

  &.syncing {
    animation: ${ConnectingAnimation} 1.2s infinite;
  }
`;

const Peers = styled.div`
  padding-left: 1vw;
  font-family: monospace;
`;

const TickAndEpoch = styled.div`
  padding-left: 1vw;
  font-family: monospace;
`;

const ConnectionStatus = function () {
  const { connectionInfo } = useContext(ConnectionContext);
  const [numberOfPeers, setNumberOfPeers] = useState(0);
  const [statusTimeout, setStatusTimeout] = useState(undefined);
  const [prevStatus, setPrevStatus] = useState(undefined);
  const [backgroundColor, setBackgroundColor] = useState('#777');
  const [synced, setSynced] = useState(false);

  useLayoutEffect(
    function () {
      if (connectionInfo?.computerState?.status) {
        setPrevStatus(connectionInfo?.computerState.status);
        switch (connectionInfo?.computerState.status) {
          case 0:
            clearTimeout(statusTimeout);
            setStatusTimeout(undefined);
            setSynced(false);
            setBackgroundColor('#777');
            break;
          case 1:
            if (statusTimeout === undefined) {
              setStatusTimeout(
                setTimeout(
                  function () {
                    setSynced(false);
                    setBackgroundColor('#db3918');
                  },
                  prevStatus !== undefined && prevStatus < 1 ? 0 : 5000
                )
              );
            }
            break;
          case 2:
            clearTimeout(statusTimeout);
            setStatusTimeout(undefined);
            setSynced(false);
            setBackgroundColor('yellow');
            break;
          case 3:
            clearTimeout(statusTimeout);
            setStatusTimeout(undefined);
            setSynced(true);
            setBackgroundColor('green');
            break;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connectionInfo]
  );

  useEffect(
    function () {
      if (connectionInfo !== undefined) {
        if (connectionInfo?.peers) {
          setNumberOfPeers(
            connectionInfo?.peers.filter(function ({ readyState }) {
              return readyState === 1;
            })?.length
          );
        }
      }
    },
    [connectionInfo]
  );

  return (
    <>
      <Indicator
        className={`${synced === false ? 'syncing' : ''}`}
        backgroundColor={backgroundColor}
      ></Indicator>
      {connectionInfo?.computerState?.tick !== undefined && (
        <TickAndEpoch>
          {connectionInfo.computerState.tick?.toString()}
          {'|'}
          {connectionInfo.computerState.epoch?.toString()}
        </TickAndEpoch>
      )}
      <Peers>
        {numberOfPeers.toString() || '0'}
        {'/3'}
      </Peers>
    </>
  );
};

export default ConnectionStatus;
