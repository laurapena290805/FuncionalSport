import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // Importa la página principal (Home)
import AdminPanel from './AdminPanel'; // Importa la página de administrador (AdminPanel)
import Login from './Login';
import UserPanel from './UserPanel';
import Usuarios from './Usuarios';
//import Clases from './Clases';
import ReportesPago from './ReportesPago';

function App() {
  return (
    <div className="App">
    
      {/* Configuración de las rutas */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página principal */}
        <Route path="/admin" element={<AdminPanel />}/> {/* Página de administrador */}
        <Route path="/login" element={<Login />} /> {/* Página de inicio de sesión} */}
        <Route path="/user/:userId" element={<UserPanel />} /> {/* Página de usuario} */}
        <Route path="/usuarios" element={<Usuarios />} /> {/* Página de usuarios} */}
        {/* <Route path="/clases" element={<Clases />} /> {/* Página de clases} */}
        <Route path="/reportes" element={<ReportesPago />} /> {/* Página de reportes de pago} */}
      </Routes>
    </div>
  );
}

export default App;
