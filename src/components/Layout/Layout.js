import React from 'react';
import './Layout.css'; // Import CSS for styling

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {children} {/* Render children (page content) */}
    </div>
  );
};

export default Layout;
