import React from 'react';
import Navbar from '../components/Navbar';

const EtudiantLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ padding: '20px' }}>{children}</main>
  </>
);

export default EtudiantLayout;
