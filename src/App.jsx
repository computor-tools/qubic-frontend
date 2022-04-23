import './App.css';
import Layout from './components/Layout';
import { AuthProvider } from './components/AuthProvider';
import { ConnectionProvider } from './components/ConnectionProvider';
import RequireAuth from './components/RequireAuth';
import Login from './containers/Login';
import Stats from './containers/Stats';
import Author from './containers/Author';
import Computor from './containers/Computor';
import Wallet from './containers/Wallet';
import Settings from './containers/Settings';
import { useHeight } from './hooks/element';
import React, { useReducer, useRef } from 'react';
import { Navigate, Routes, Route } from 'react-router';

const initialState = {};

const reducer = function (state, { action, value }) {
  switch (action) {
    case 'SET_CONNECTION_INFO':
      return {
        ...state,
        connectionInfo: {
          ...state.connectionInfo,
          ...value,
        },
      };
    case 'SET_ENERGY':
      return {
        ...state,
        energy: value,
      };
    case 'CLEAR_TRANSFERS':
      return {
        ...state,
        transfers: {},
      };
    case 'SET_TRANSFER':
      return {
        ...state,
        transfers: {
          ...state.transfers,
          [value.hash]: { ...value, unseen: 100, seen: 0, processed: 0 },
        },
      };
    case 'SET_TRANSFER_STATUS': {
      const seen = (100 * value.seen) / (26 * 26);
      const processed = (100 * value.processed) / (26 * 26);
      const unseen = (100 * value.unseen) / (26 * 26);
      return {
        ...state,
        transfers: {
          ...state.transfers,
          [value.hash]: {
            ...state.transfers[value.hash],
            unseen,
            seen,
            processed,
          },
        },
      };
    }
    case 'SET_TRANSFER_RECEIPT': {
      return {
        ...state,
        transfers: {
          ...state.transfers,
          [value.hash]: {
            ...state.transfers[value.hash],
            receipt: [value.receiptBase64],
          },
        },
      };
    }
  }
};

const App = function () {
  const [state, dispatch] = useReducer(reducer, initialState);

  const headerRef = useRef();
  const headerHeight = useHeight(headerRef);

  return (
    <ConnectionProvider connectionInfo={state.connectionInfo}>
      <AuthProvider transfers={state.transfers} energy={state.energy} dispatch={dispatch}>
        <Routes>
          <Route path="/" element={<Layout ref={headerRef} />}>
            <Route
              index
              element={
                <RequireAuth>
                  <Navigate to="/wallet" />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/wallet/*"
              element={
                <RequireAuth>
                  <Wallet headerHeight={headerHeight} />
                </RequireAuth>
              }
            />
            <Route path="/IDE" element={<Author headerHeight={headerHeight} />} />
            <Route path="/computor" element={<Computor />} />
            <Route path="/stats/*" element={<Stats headerHeight={headerHeight} />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ConnectionProvider>
  );
};

export default App;
