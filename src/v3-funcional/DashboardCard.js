// src/DashboardCard.js
import React from 'react';
import './02-DashboardLayout.css'; // Usamos el mismo CSS

const DashboardCard = ({ title, value }) => {
  return (
    <div className="dashboard-card">
      <div className="card-title">{title}</div>
      {value !== undefined && (
        <div className="card-value">{value}</div>
      )}
    </div>
  );
};

export default DashboardCard;

