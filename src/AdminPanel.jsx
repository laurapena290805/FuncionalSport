import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import { getPersonas } from "./services/api";

function AdminPanel() {
  const [personas, setPersonas] = useState([]);
  const [personasFiltradas, setPersonasFiltradas] = useState([]);

  // Fetch personas data when the component mounts
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

    const personasConVencimientoProximo = personas.filter(persona => {
      const fechaInscripcion = new Date(persona.fecha);
      const fechaVencimiento = new Date(fechaInscripcion);
      fechaVencimiento.setMonth(fechaInscripcion.getMonth() + 1); // El vencimiento es un mes después de la inscripción

      // Restar 10 días a la fecha de vencimiento
      const fechaLimite = new Date(fechaVencimiento);
      fechaLimite.setDate(fechaVencimiento.getDate() - 10); // 10 días antes del vencimiento

      // Comprobamos si la fecha límite es posterior a la fecha actual y si el vencimiento es en los próximos 10 días
      const diferenciaDias = Math.ceil((fechaLimite - fechaActual) / (1000 * 3600 * 24)); // Diferencia en días

      return diferenciaDias <= 0 && diferenciaDias > -11; // 10 días antes del vencimiento o el mismo día
    });

    setPersonasFiltradas(personasConVencimientoProximo);
  };

  const clasesDelDia = [
    { hora: '9:00 AM', clase: 'Yoga', alumnos: 12 },
    { hora: '11:00 AM', clase: 'Crossfit', alumnos: 15 },
    { hora: '5:00 PM', clase: 'Funcional', alumnos: 10 },
    { hora: '7:00 PM', clase: 'Zumba', alumnos: 20 },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-picture"></div>
          <p>Administrador</p>
        </div>
        <nav className="menu">
          <button className="menu-item active">Usuarios</button>
          <button className="menu-item">Clases</button>
          <button className="menu-item">Entrenamientos</button>
          <button className="menu-item">Reportes</button>
        </nav>
        <button className="logout">Cerrar Sesión</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Clases del día */}
        <section className="section">
          <h2>Clases del día</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Clase</th>
                <th>Alumnos</th>
              </tr>
            </thead>
            <tbody>
              {clasesDelDia.map((clase, index) => (
                <tr key={index}>
                  <td>{clase.hora}</td>
                  <td>{clase.clase}</td>
                  <td>{clase.alumnos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Mensualidades a vencer */}
        <section className="section">
          <h2>Mensualidades a vencer</h2>
          <table className="personas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {personasFiltradas.map((persona) => (
                <tr key={persona.id}>
                  <td>{persona.id}</td>
                  <td>{persona.nombre}</td>
                  <td>{persona.telefono}</td>
                  <td>{persona.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default AdminPanel;
