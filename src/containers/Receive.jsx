import React, { memo, useEffect, useRef, useState } from 'react';
import { createIdentity, PUBLIC_KEY_LENGTH } from 'qubic-js';
import QRCode from 'qrcode';
import { useLocalStorage } from '../hooks/local-storage';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';

const History = function ({ identities }) {
  return (
    <div className="Receive-identities">
      <h4>History</h4>
      {identities.map(function (identity, i) {
        return (
          <div className="Receive-identity" key={i}>
            <div className="Receive-identity-text">
              {identity}
              <button
                onClick={function () {
                  navigator.clipboard.writeText(identity);
                }}
              >
                Copy
              </button>
            </div>
            <div className="Receive-identity-balance">
              {Math.floor(Math.random() * 10000000)} QU
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MemoizedHistory = memo(History);

const Receive = function () {
  const [index, setIndex] = useLocalStorage('identity-index', 0);
  const [newIdentity, setNewIdentity] = useState('');
  const [copiednewIdentity, setCopiednewIdentity] = useState(false);
  const [identities, setIdentities] = useState([]);
  const canvasRef = useRef();

  const createNewIdentity = function (i) {
    createIdentity('vmscmtbcqjbqyqcckegsfdsrcgjpeejobolmimgorsqwgupzhkevreu', i).then(function (
      identity
    ) {
      setNewIdentity(identity);
      QRCode.toCanvas(canvasRef.current, identity, { width: 250 });
    });
  };

  useEffect(
    function () {
      if (newIdentity === '' && index !== undefined && canvasRef.current !== undefined) {
        createNewIdentity(parseInt(index, 10));
        for (let i = parseInt(index, 10) - 1; i >= 0; i--) {
          createIdentity('vmscmtbcqjbqyqcckegsfdsrcgjpeejobolmimgorsqwgupzhkevreu', i, 10).then(
            function (identity) {
              setIdentities(function (value) {
                return [...value, identity];
              });
            }
          );
        }
      }
    },
    [canvasRef, index, newIdentity]
  );

  return (
    <div>
      <div className="Receive-new-identity">
        <canvas className="Receive-new-identity-qr" ref={canvasRef}></canvas>
        <div
          className={`Receive-new-identity-text${copiednewIdentity ? ' copied' : ''}`}
          onClick={function () {
            navigator.clipboard.writeText(newIdentity);
            setCopiednewIdentity(true);
            setTimeout(function () {
              setCopiednewIdentity(false);
            }, 3000);
          }}
        >
          {newIdentity.slice(0, PUBLIC_KEY_LENGTH * 2)}
          <span className="Receive-new-identity-text-checksum">
            {newIdentity.slice(PUBLIC_KEY_LENGTH * 2)}
          </span>
          {copiednewIdentity && <div className="Receive-new-identity-text-copied">Copied</div>}
        </div>
        <div className="Receive-new-identity-actions">
          <button
            onClick={function () {
              setIdentities(function (value) {
                return [newIdentity, ...value];
              });
              setIndex(parseInt(index, 10) + 1);
              createNewIdentity(parseInt(index, 10) + 1);
            }}
          >
            <AddIcon />
            New identity
          </button>
          <button
            onClick={function () {
              navigator.clipboard.writeText(newIdentity);
              setCopiednewIdentity(true);
              setTimeout(function () {
                setCopiednewIdentity(false);
              }, 3000);
            }}
          >
            <ContentCopyIcon />
            Copy
          </button>
        </div>
      </div>
      <MemoizedHistory identities={identities} />
    </div>
  );
};

export default Receive;
