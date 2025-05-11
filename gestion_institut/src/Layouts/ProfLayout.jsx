import React from 'react';
import NavbarProf from '../components/NavbarProf'; // à créer ou importer

const ProfLayout = ({ children }) => (
  <>
    <NavbarProf />
    <main style={{ padding: '20px' }}>{children}</main>
  </>
);

export default ProfLayout;
