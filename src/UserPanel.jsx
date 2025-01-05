import React from 'react';
import './UserPanel.css';

function UserPanel() {
  const classes = [
    { time: '9:00 AM', name: 'Yoga' },
    { time: '11:00 AM', name: 'Crossfit' },
    { time: '5:00 PM', name: 'Funcional' },
    { time: '7:00 PM', name: 'Zumba' },
  ];

  return (
    <div className="user-panel-container">
      <header className="user-header">
        <div className="user-profile-picture"></div>
        <div className="user-profile-info">Usuario</div>
        <div className="user-profile-icon">
          <i className="fas fa-user"></i>
        </div>
      </header>

      <main className="user-main-content">
        <section className="user-classes-calendar">
          <h2>Clases del Día</h2>
          <table className="user-calendar">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Clase</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem, index) => (
                <tr key={index}>
                  <td>{classItem.time}</td>
                  <td>{classItem.name}</td>
                  <td>
                    <button className="user-button">Agregar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="user-section">
          <section className="user-progress">
            <h2>Progreso</h2>
            <div className="user-progress-box">
              <p>Aquí puedes mostrar gráficos o estadísticas del progreso del usuario.</p>
            </div>
          </section>

          <section className="user-membership-status">
            <h2>Estado de la Mensualidad</h2>
            <div className="user-membership-box">
              <p>Mensualidad activa hasta: 05/01/2025</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


export default UserPanel;