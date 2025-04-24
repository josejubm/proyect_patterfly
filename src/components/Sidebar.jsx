// src/Sidebar.jsx
import React from 'react';
import { Nav, NavItem, NavList, PageSidebar, PageSidebarBody } from '@patternfly/react-core';
import { NavLink, useLocation } from 'react-router-dom';
import { routes } from '../routes';

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();

  const pageNav = (
    <Nav aria-label="Nav">
      <NavList>
        {routes.map((route, index) => (
          <NavItem
            key={index}
            itemId={index}
            isActive={location.pathname === route.path}
            component="div" // Usamos "div" como contenedor
          >
            <NavLink
              to={route.path}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {route.icon && <span style={{ marginRight: 8 }}>{route.icon}</span>}
              {route.name}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );

  return (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>{pageNav}</PageSidebarBody>
    </PageSidebar>
  );
};

export default Sidebar;
