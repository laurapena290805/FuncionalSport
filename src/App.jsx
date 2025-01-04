import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // Importa la página principal (Home)
import AdminPanel from './AdminPanel'; // Importa la página de administrador (AdminPanel)
import Login from './Login';
import UserPanel from './User/UserPanel';
import Usuarios from './Usuarios';

function App() {
  return (
    <div className="App">
    
      {/* Configuración de las rutas */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página principal */}
        <Route path="/admin" element={<AdminPanel />}/> {/* Página de administrador */}
        <Route path="/login" element={<Login />} /> {/* Página de inicio de sesión} */}
        <Route path="/user" element={<UserPanel />} /> {/* Página de usuario} */}
        <Route path="/usuarios" element={<Usuarios />} /> {/* Página de usuarios} */}
      </Routes>
    </div>
  );
}

export default App;
