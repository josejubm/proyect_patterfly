// src/DashboardCard.js
import React from 'react';
import './02-DashboardLayout.css';

const DashboardCard = ({ title }) => {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
    </div>
  );
};

export default DashboardCard;

