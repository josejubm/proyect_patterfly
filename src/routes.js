// src/routes.js
import { lazy } from 'react';
import { ClusterIcon, HomeIcon, NetworkIcon, OutlinedCommentIcon } from '@patternfly/react-icons';
import Bot from './pages/Bot';
//prueba
import Botest from './pages/Botest';

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
  {
    path: '/bot',
    element: <Bot/>,
    name: 'BOT',
    icon: <OutlinedCommentIcon/>
  },
  {
    path: '/bot2',
    element: <Botest/>,
    name: 'BOTest',
    icon: <OutlinedCommentIcon/>
  },
  



];

