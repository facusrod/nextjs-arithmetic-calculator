import React from 'react';
import NavBar from './navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar/>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;