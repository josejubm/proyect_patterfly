// src/routes.js
import { lazy } from 'react';
import { ClusterIcon, HomeIcon, NetworkIcon } from '@patternfly/react-icons';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardOcs = lazy(() => import('./pages/OcsInventory'));

export const routes = [
  {
    path: '/',
    element: <Dashboard />,
    name: 'Main Dashboard',
    icon:  <HomeIcon/>,
  },
   {
    path: '/servicenow',
    element: <div>Service Now Page</div>,
    name: 'Service Now',
    icon: <ClusterIcon/>
  },
  {
    path: '/ocs',
    element: <DashboardOcs/> ,
    name: 'Ocs Inventory',
    icon: <NetworkIcon/>
  },
  {
    path: '/itop',
    element: <div>Itop Page</div>,
    name: 'ITOP',
    icon: <NetworkIcon/>
  },
];

