import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@patternfly/react-core/dist/styles/base.css';

// Importa los componentes directamente (no como objetos)
import DashboardLayout from './DashboardLayout';
import { routes } from './routes';

// Verifica que cada ruta.element sea un componente válido
const validatedRoutes = routes.map(route => ({
  ...route,
  element: React.isValidElement(route.element) ? route.element : <div>Componente inválido</div>
}));

const App = () => {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            {validatedRoutes.map((route, index) => (
              <Route 
                key={index} 
                path={route.path} 
                element={route.element} 
              />
            ))}
          </Routes>
        </Suspense>
      </DashboardLayout>
    </BrowserRouter>
  );
};

export default App;