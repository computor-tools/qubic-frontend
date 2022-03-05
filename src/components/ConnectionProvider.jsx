import { createContext, useEffect, useState } from 'react';
import qubic from 'qubic-js';

export const ConnectionContext = createContext(null);

export const ConnectionProvider = function ({ children, connectionInfo, dispatch }) {
  const [connection, setConnection] = useState(undefined);
  useEffect(
    function () {
      const con = qubic.connection({
        peers: [],
        computerStateSynchronizationTimeoutDuration: 1000,
        computerStateSynchronizationDelayDuration: 3000,
        connectionTimeoutDuration: 5000,
        adminPublicKey: 'MGEBBBMCLILFBGOBFJCLNBBADELCIBAMGPGMFIDLPIPGIOLOGJAJGNIEAAALEEKFAEDGOH',
      });
      setConnection(con);
      const connectionErrorListener = function () {};

      const connectionInfoListener = function (value) {
        dispatch({
          action: 'SET_CONNECTION_INFO',
          value,
        });
      };

      con.addListener('error', connectionErrorListener);
      con.addListener('info', connectionInfoListener);

      return function () {
        con.removeListener('error', connectionErrorListener);
        con.removeListener('info', connectionInfoListener);
      };
    },
    [dispatch]
  );

  return (
    <ConnectionContext.Provider
      value={{
        ...connection,
        connectionInfo,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
