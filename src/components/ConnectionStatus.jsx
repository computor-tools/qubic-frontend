import { useContext } from 'react';
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

  &.syncing {
    animation: ${ConnectingAnimation} 1.2s infinite;
  }
`;

const ConnectionStatus = function () {
  const { connectionInfo } = useContext(ConnectionContext);
  let synced = false;
  let backgroundColor;

  switch (connectionInfo?.syncStatus) {
    case 0:
      backgroundColor = '#777';
      break;
    case 1:
      backgroundColor = '#db3918';
      break;
    case 2:
      backgroundColor = 'yellow';
      break;
    case 3:
      synced = true;
      backgroundColor = 'green';
      break;
    default:
      backgroundColor = '#777';
  }

  return (
    <Indicator
      className={`${synced === false ? 'syncing' : ''}`}
      backgroundColor={backgroundColor}
    ></Indicator>
  );
};

export default ConnectionStatus;
