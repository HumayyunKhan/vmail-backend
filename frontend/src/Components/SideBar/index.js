import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';
import { Outlet } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>

<div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-toggle" onClick={handleToggle}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </div>
      <div className="sidebar-content">
        <div className="sidebar-logo">
          {/* Your logo here */}
          <h2>Logo</h2>
        </div>
        <ul className="sidebar-menu">
          <li>Menu Item 1</li>
          <li>Menu Item 2</li>
          <li>Menu Item 3</li>
          {/* Add more menu items as needed */}
        </ul>
      </div>
    </div>
    <Outlet/>
    </div>
  );
};

export default Sidebar;
