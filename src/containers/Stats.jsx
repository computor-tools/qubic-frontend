import React from 'react';
import Computors from './Computors';
import QUs from './QUs';
import { Navigate, Routes, Route } from 'react-router';

const Stats = function ({ headerHeight }) {
  return (
    <Routes>
      <Route index element={<Navigate to="/stats/computors" />} />
      <Route path="/computors" element={<Computors headerHeight={headerHeight} />} />
      <Route path="/qubics" element={<div>Qubics</div>} />
      <Route path="/qus" element={<QUs headerHeight={headerHeight} />} />
    </Routes>
  );
};

export default Stats;
