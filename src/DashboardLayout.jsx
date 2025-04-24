// src/DashboardLayout.jsx
import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Page,
  SkipToContent
} from '@patternfly/react-core';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainContainerId = 'main-content-page-layout';

  const handleClick = (event) => {
    event.preventDefault();
    const mainContentElement = document.getElementById(mainContainerId);
    if (mainContentElement) {
      mainContentElement.focus();
    }
  };

  const pageSkipToContent = (
    <SkipToContent onClick={handleClick} href={`#${mainContainerId}`}>
      Saltar al contenido
    </SkipToContent>
  );

  const dashboardBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem>Inicio</BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>
        Dashboard
      </BreadcrumbItem>
    </Breadcrumb>
  );

  return (
    <>
      <Header onNavToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Page
        sidebar={<Sidebar isSidebarOpen={isSidebarOpen} />}
        skipToContent={pageSkipToContent}
        breadcrumb={dashboardBreadcrumb}
        mainContainerId={mainContainerId}
        isHorizontalSubnavWidthLimited
        isBreadcrumbWidthLimited
        isBreadcrumbGrouped
        //  isManagedSidebar
      >
        {children}
      </Page>
    </>
  );
};

export default DashboardLayout;
