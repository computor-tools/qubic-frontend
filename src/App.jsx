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
  }
};

const App = function () {
  const [state, dispatch] = useReducer(reducer, initialState);

  const headerRef = useRef();
  const headerHeight = useHeight(headerRef);

  return (
    <ConnectionProvider connectionInfo={state.connectionInfo} dispatch={dispatch}>
      <AuthProvider>
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
            <Route path="/author" element={<Author />} />
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
