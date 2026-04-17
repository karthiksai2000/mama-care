import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import EmergencySOS from './EmergencySOS';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-container">
      <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="main-wrapper">
        <Sidebar isOpen={sidebarOpen} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <EmergencySOS />
    </div>
  );
};

export default Layout;
