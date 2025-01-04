import React from 'react';
import './AdminPanel.css';

function AdminPanel() {
  const clasesDelDia = [
    { hora: '9:00 AM', clase: 'Yoga', alumnos: 12 },
    { hora: '11:00 AM', clase: 'Crossfit', alumnos: 15 },
    { hora: '5:00 PM', clase: 'Funcional', alumnos: 10 },
    { hora: '7:00 PM', clase: 'Zumba', alumnos: 20 },
  ];

  const mensualidades = [
    { nombre: 'Juan Pérez', vencimiento: '05/01/2025', telefono: '123-456-7890' },
    { nombre: 'Ana López', vencimiento: '08/01/2025', telefono: '987-654-3210' },
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
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha de Vencimiento</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {mensualidades.map((mensualidad, index) => (
                <tr key={index}>
                  <td>{mensualidad.nombre}</td>
                  <td>{mensualidad.vencimiento}</td>
                  <td>{mensualidad.telefono}</td>
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
