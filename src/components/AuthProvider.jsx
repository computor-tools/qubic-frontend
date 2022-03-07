import { createContext, useContext, useEffect, useState } from 'react';
import { ConnectionContext } from './ConnectionProvider';
import qubic from 'qubic-js';

export const AuthContext = createContext(undefined);

export const AuthProvider = function ({ children, transfers, energy, dispatch }) {
  const connection = useContext(ConnectionContext);
  const [seed, setSeed] = useState('');
  const [client, setClient] = useState(undefined);
  const [computorIpForRemoteControl, setComputorIpForRemoteControl] = useState('');
  const [computor, setComputor] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(undefined);
  const errorListener = function () {};

  useEffect(
    function () {
      const energyListener = function (value) {
        dispatch({
          action: 'SET_ENERGY',
          value,
        });
      };

      const transferListener = function (value) {
        dispatch({
          action: 'SET_TRANSFER',
          value,
        });
      };

      // eslint-disable-next-line no-unused-vars
      const transferStatusListener = function (value) {
        dispatch({
          action: 'SET_TRANSFER_STATUS',
          value,
        });
      };

      if (client === undefined && connection !== undefined && seed !== '') {
        try {
          const client2 = qubic.client({
            seed,
            connection,
          });

          client2.addListener('error', errorListener);
          client2.addListener('transfer', transferListener);
          client2.addListener('energy', energyListener);
          client2.addListener('transferStatus', transferStatusListener);

          setClient(client2);
          setLoggedIn(true);
          setError(undefined);
        } catch (error) {
          setError(error.message);
        }
      } else if (client !== undefined && seed === '') {
        client.terminate({ closeConnection: false }).then(function () {
          client.removeListener('error', errorListener);
          client.removeListener('transfer', transferListener);
          client.removeListener('energy', energyListener);
          client.removeListener('transferStatus', transferStatusListener);

          dispatch({
            action: 'CLEAR_TRANSFERS',
          });
          dispatch({
            action: 'SET_ENERGY',
            value: 0n,
          });

          setClient(undefined);
          setLoggedIn(false);
        });
      }
    },
    [client, connection, dispatch, seed]
  );

  useEffect(
    function () {
      if (computorIpForRemoteControl !== '' && seed !== '') {
        const computor2 = qubic.computor({
          seed,
          url: `ws://${computorIpForRemoteControl}:21841`,
          reconnectTimeoutDuration: 1000,
        });
        setComputor(computor2);
      }
    },
    [seed, computorIpForRemoteControl]
  );

  return (
    <AuthContext.Provider
      value={{
        login: setSeed,
        logout() {
          setSeed('');
        },
        validateSeed(s) {
          if (s !== '' && !new RegExp(`^[a-z]+$`).test(s)) {
            setError('Invalid seed. Must be in lowercase latin chars.');
          } else {
            setError(undefined);
          }
        },
        loggedIn,
        error,
        client,
        computor,
        computorIpForRemoteControl,
        energy,
        transfers,
        setComputorIpForRemoteControl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
