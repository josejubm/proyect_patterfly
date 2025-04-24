// src/02-DashboardLayout.js
import React, { useEffect, useState } from 'react';
import './02-DashboardLayout.css';
import DashboardCard from './DashboardCard';

const DashboardLayout = () => {
  const [jobCount, setJobCount] = useState(null);

  useEffect(() => {
    const fetchJobCount = async () => {
      try {
        const response = await fetch('http://192.168.10.78:5000/api/jobs/count');
        const data = await response.json();
        setJobCount(data.count);
      } catch (error) {
        console.error('❌ Error al obtener el conteo de jobs:', error);
        setJobCount('❌');
      }
    };

    fetchJobCount();
  }, []);

  return (
    <main className="dashboard-layout">
      <div className="overview-card">
        <h2 className="overview-title">Overview AWX</h2>
        <div className="overview-grid">
          <DashboardCard title="Jobs Ejecutados" value={jobCount} />
          <DashboardCard title="Hosts" />
          <DashboardCard title="Playbooks" />
          <DashboardCard title="Inventarios" />
          <DashboardCard title="Usuarios" />
          <DashboardCard title="Organizaciones" />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
