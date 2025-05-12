import React from 'react';
import NavbarAdmin from '../components/NavbarAdmin';

const AdminLayout = ({ children }) => (
  <>
    <NavbarAdmin />
    <main style={{ padding: '20px' }}>{children}</main>
  </>
);

export default AdminLayout;
