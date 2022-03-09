import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import Send from './Send';
import Exchange from './Exchange';
import { AuthContext } from '../components/AuthProvider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { PUBLIC_KEY_LENGTH } from 'qubic-js';
import styled from 'styled-components';
import { PUBLIC_KEY_LENGTH_IN_HEX } from 'qubic-js/src/identity';
import Import from './Import';

const Transfers = styled.ul`
  width: calc(1050px + 2vw);
  margin: auto;
  padding: 2vh 0;
  li:nth-child(2n + 1) {
    background: #000;
  }
  li:first-of-type {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  li:last-of-type {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const Transfer = styled.li`
  padding: 2vh 1vw;
  margin: 0;
  list-style: none;
  font-family: monospace;
`;

const TransferHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1vh 0;
`;

const Hash = styled.div`
  font-size: 16px;
`;

const Energy = styled.div`
  font-size: 16px;
  color: ${function (params) {
    return params.color;
  }};
  font-weight: bold;
`;

const TransferDetails = styled.div`
  line-height: 160%;
`;

const Checksum = styled.span`
  color: #00ffe9;
`;

const ReceiptButton = styled.button`
  width: ${function (props) {
    return props.width || 'auto';
  }};
  background-color: ${function (props) {
    return props.backgroundColor || '#00ffe9';
  }};
  font-size: ${function (props) {
    return props.fontSize || '14px';
  }};
  font-weight: bold;
  padding: 0.3vh 1vw;
  border: 0;
  border-radius: 30px;
  margin-top: 1vh;
  align-self: ${function (props) {
    return props.alignSelf;
  }};
  color: #000;
  cursor: pointer;
`;

const WalletHome = function () {
  const [identity, setIdentity] = useState('');
  const [copiedIdentity, setCopiedIdentity] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState();
  const { client, transfers } = useContext(AuthContext);

  useEffect(
    function () {
      let isMounted = true;
      if (client !== undefined) {
        client.identity.then(function (identity2) {
          if (isMounted) {
            setIdentity(identity2);
          }
        });
      }
      return function () {
        isMounted = false;
      };
    },
    [client]
  );

  const copyIdentity = function () {
    navigator.clipboard.writeText(identity);
    setCopiedIdentity(true);
    clearTimeout(copyTimeout);
    setCopyTimeout(
      setTimeout(function () {
        setCopiedIdentity(false);
      }, 3000)
    );
  };

  return (
    <div className="Container">
      <div className="Receive-new-identity">
        <div
          className={`Receive-new-identity-text${copiedIdentity ? ' copied' : ''}`}
          onClick={copyIdentity}
        >
          {identity.slice(0, PUBLIC_KEY_LENGTH * 2)}
          <span className="Receive-new-identity-text-checksum">
            {identity.slice(PUBLIC_KEY_LENGTH * 2)}
          </span>
          {copiedIdentity && <div className="Receive-new-identity-text-copied">Copied</div>}
          <button onClick={copyIdentity}>
            <ContentCopyIcon />
            Copy
          </button>
        </div>
      </div>

      <Transfers>
        {transfers &&
          Object.values(transfers)
            .sort(function (a, b) {
              if (a.timestamp < b.timestamp) {
                return 1;
              } else if (a.timestamp > b.timestamp) {
                return -1;
              } else {
                return 0;
              }
            })
            .filter(function (transfer) {
              return transfer.hash !== undefined;
            })
            .map(function (transfer, i) {
              const energy = transfer.source === transfer.destination ? 0 : transfer.energy;
              return (
                <Transfer key={i}>
                  <TransferHeader>
                    <Hash>
                      {transfer.hash} {transfer.unseen.toFixed(2)} {transfer.seen.toFixed(2)}{' '}
                      {transfer.processed.toFixed(2)}
                    </Hash>
                    <Energy
                      color={
                        energy === 0
                          ? 'white'
                          : transfer.source === identity
                          ? '#db3918'
                          : '#00ffe9'
                      }
                    >
                      {energy != 0 && transfer.source === identity && '-'}
                      {energy.toString()} qus
                    </Energy>
                  </TransferHeader>
                  <TransferDetails>
                    <div>
                      Source: {transfer.source.slice(0, PUBLIC_KEY_LENGTH_IN_HEX)}
                      <Checksum>{transfer.source.slice(PUBLIC_KEY_LENGTH_IN_HEX)}</Checksum>
                    </div>
                    <div>
                      Destination: {transfer.destination.slice(0, PUBLIC_KEY_LENGTH_IN_HEX)}
                      <Checksum>{transfer.destination.slice(PUBLIC_KEY_LENGTH_IN_HEX)}</Checksum>
                    </div>
                    <div>{transfer.timestamp.toString()}</div>
                    {transfer.receipt && (
                      <ReceiptButton
                        onClick={function () {
                          navigator.clipboard.writeText(transfer.receipt);
                        }}
                      >
                        Copy receipt
                      </ReceiptButton>
                    )}
                  </TransferDetails>
                </Transfer>
              );
            })}
      </Transfers>
    </div>
  );
};

const Wallet = function ({ headerHeight }) {
  return (
    <Routes>
      <Route index element={<WalletHome />} />
      <Route path="/send" element={<Send />} />
      <Route path="/import" element={<Import />} />
      <Route path="/exchange" element={<Exchange headerHeight={headerHeight} />} />
    </Routes>
  );
};

export default Wallet;
