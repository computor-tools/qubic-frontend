import React, { useContext, useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router';
import Send from './Send';
import Exchange from './Exchange';
import { AuthContext } from '../components/AuthProvider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { PUBLIC_KEY_LENGTH } from 'qubic-js';
import QRCode from 'qrcode';

const Wallet = function ({ headerHeight }) {
  const WalletHome = function () {
    const [identity, setIdentity] = useState('');
    const [copiedIdentity, setCopiedIdentity] = useState(false);
    const canvasRef = useRef();
    const { client } = useContext(AuthContext);

    useEffect(
      function () {
        let isMounted = true;
        if (client !== undefined && canvasRef.current !== undefined) {
          client.identity.then(function (identity2) {
            if (isMounted) {
              setIdentity(identity2);
              QRCode.toCanvas(canvasRef.current, identity2, { width: 250 });
            }
          });
        }
        return function () {
          isMounted = false;
        };
      },
      [client, canvasRef]
    );

    const copyIdentity = function () {
      navigator.clipboard.writeText(identity);
      setCopiedIdentity(true);
      setTimeout(function () {
        setCopiedIdentity(false);
      }, 3000);
    };

    return (
      <div className="Container">
        <div className="Receive-new-identity">
          <canvas className="Receive-new-identity-qr" ref={canvasRef}></canvas>
          <div
            className={`Receive-new-identity-text${copiedIdentity ? ' copied' : ''}`}
            onClick={copyIdentity}
          >
            {identity.slice(0, PUBLIC_KEY_LENGTH * 2)}
            <span className="Receive-new-identity-text-checksum">
              {identity.slice(PUBLIC_KEY_LENGTH * 2)}
            </span>
            {copiedIdentity && <div className="Receive-new-identity-text-copied">Copied</div>}
          </div>
          <div className="Receive-new-identity-actions">
            <button onClick={copyIdentity}>
              <ContentCopyIcon />
              Copy
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route index element={<WalletHome />} />
      <Route path="/send" element={<Send />} />
      <Route path="/exchange" element={<Exchange headerHeight={headerHeight} />} />
    </Routes>
  );
};

export default Wallet;
