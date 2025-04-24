

  // src/utils/obtenerDatos.js

export const obtenerDatosAwx = async () => {
    const endpoints = {
      jobs: 'http://100.108.243.76/cgi-bin/07-awx-contar-jobs.sh',
      hosts: 'http://100.108.243.76/cgi-bin/06-awx-contar-hosts.sh',
      playbooks: 'http://100.108.243.76/cgi-bin/04-awx-contar-proyectos.sh',
      inventories: 'http://100.108.243.76/cgi-bin/05-awx-contar-inventarios.sh',
     users: 'http://100.108.243.76/cgi-bin/03-awx-contar-usuarios.sh',
     organizations: 'http://100.108.243.76/cgi-bin/02-awx-contar-organizaciones.sh',
    };
  
    const datos = {};
  
    for (const [key, url] of Object.entries(endpoints)) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        datos[key] = text.trim();
      } catch (error) {
        console.error(`❌ Error al obtener ${key}:`, error.message);
        datos[key] = '❌';
      }
    }
  
    return datos;
  };
  