import { createContext, useEffect, useState } from 'react';
import { createConnection } from 'qubic-js';

export const ConnectionContext = createContext(null);

export const ConnectionProvider = function ({ children, connectionInfo, dispatch }) {
  const [connection, setConnection] = useState(undefined);
  useEffect(
    function () {
      const connection2 = createConnection({
        computors: [
          { url: 'ws://localhost' },
          { url: 'ws://localhost' },
          { url: 'ws://localhost' },
        ],
        synchronizationInterval: 10000,
      });
      setConnection(connection2);
      const connectionErrorListener = function (error) {
        console.log(error);
      };

      const connectionInfoListener = function (value) {
        dispatch({
          action: 'SET_CONNECTION_INFO',
          value,
        });
      };

      connection2.addListener('error', connectionErrorListener);
      connection2.addListener('info', connectionInfoListener);

      return function () {
        connection2.removeListener('error', connectionErrorListener);
        connection2.removeListener('info', connectionInfoListener);
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
