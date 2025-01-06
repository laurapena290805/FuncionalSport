import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import { getPersonas } from './services/api';
import Principal from './Principal';
import Usuarios from './Usuarios';
import Clases from './Clases';

function AdminPanel() {
  const [view, setView] = useState('principal');
  const [personas, setPersonas] = useState([]);
  const [personasFiltradas, setPersonasFiltradas] = useState([]);
  const navigate = useNavigate(); // Inicializa useNavigate para redirección

  const clasesDelDia = [
    { hora: '9:00 AM', clase: 'Yoga', alumnos: 12 },
    { hora: '11:00 AM', clase: 'Crossfit', alumnos: 15 },
    { hora: '5:00 PM', clase: 'Funcional', alumnos: 10 },
    { hora: '7:00 PM', clase: 'Zumba', alumnos: 20 },
  ];

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    const data = await getPersonas();
    setPersonas(data);
    filtrarPersonasVencimiento(data);
  };

  const filtrarPersonasVencimiento = (personas) => {
    const fechaActual = new Date();
    const personasConVencimientoProximo = personas.filter((persona) => {
      const fechaInscripcion = new Date(persona.fecha);
      const fechaVencimiento = new Date(fechaInscripcion);
      fechaVencimiento.setMonth(fechaInscripcion.getMonth() + 1);
      const fechaLimite = new Date(fechaVencimiento);
      fechaLimite.setDate(fechaVencimiento.getDate() - 10);
      const diferenciaDias = Math.ceil((fechaLimite - fechaActual) / (1000 * 3600 * 24));
      return diferenciaDias <= 0 && diferenciaDias > -11;
    });
    setPersonasFiltradas(personasConVencimientoProximo);
  };

  const handleLogout = () => {
    // Elimina cualquier dato de sesión almacenado
    localStorage.removeItem('authToken'); // Ejemplo: Borra un token almacenado
    sessionStorage.removeItem('authToken'); // Si usaste sessionStorage

    // Redirige al usuario a la página de inicio de sesión
    navigate('/login');
  };

  const renderContent = () => {
    switch (view) {
      case 'principal':
        return <Principal personasFiltradas={personasFiltradas} clasesDelDia={clasesDelDia} />;
      case 'usuarios':
        return <Usuarios />;
      case 'clases':
        return <Clases />;
      default:
        return <h2>Página no encontrada</h2>;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-picture"></div>
          <p>Administrador</p>
        </div>
        <nav className="menu">
          <button className={`menu-item ${view === 'principal' ? 'active' : ''}`} onClick={() => setView('principal')}>
            Principal
          </button>
          <button className={`menu-item ${view === 'usuarios' ? 'active' : ''}`} onClick={() => setView('usuarios')}>
            Usuarios
          </button>
          <button className={`menu-item ${view === 'clases' ? 'active' : ''}`} onClick={() => setView('clases')}>
            Clases
          </button>
        </nav>
        <button className="logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default AdminPanel;
