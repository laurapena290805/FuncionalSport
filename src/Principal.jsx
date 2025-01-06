// Principal.jsx
import React from 'react';

function Principal({ personasFiltradas, clasesDelDia }) {
  return (
    <div>
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
      </section>
    </div>
  );
}

export default Principal;
