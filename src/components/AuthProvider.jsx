import { createContext, useContext, useEffect, useState } from 'react';
import { ConnectionContext } from './ConnectionProvider';
import { createClient } from 'qubic-js';

export const AuthContext = createContext(undefined);

export const AuthProvider = function ({ children }) {
  const connection = useContext(ConnectionContext);
  const [seed, setSeed] = useState('');
  const [client, setClient] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(undefined);

  const login = function (seed2) {
    setSeed(seed2);
  };

  const logout = function () {
    setSeed('');
  };

  const errorListener = function () {};

  useEffect(
    function () {
      if (client === undefined && connection !== undefined && seed !== '') {
        try {
          const client2 = createClient({
            seed,
            connection,
          });

          client2.addListener('error', errorListener);

          setClient(client2);
          setLoggedIn(true);
          setError(undefined);

          return function () {
            client2.removeListener('error', errorListener);
          };
        } catch (error) {
          setError(error.message);
        }
      } else if (client !== undefined && seed === '') {
        client.terminate({ closeConnection: false }).then(function () {
          client.removeListener('error', errorListener);

          setClient(undefined);
          setLoggedIn(false);
        });
      }
    },
    [client, connection, seed]
  );

  const validateSeed = function (s) {
    if (s !== '' && !new RegExp(`^[a-z]+$`).test(s)) {
      setError('Invalid seed. Must be in lowercase latin chars.');
    } else {
      setError(undefined);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, error, client, validateSeed }}>
      {children}
    </AuthContext.Provider>
  );
};
