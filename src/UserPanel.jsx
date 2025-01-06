import React, { useState, useEffect } from "react";
import { getPersonaById } from "./services/api";
import { useNavigate, useParams } from "react-router-dom";
import "./UserPanel.css";

const UserPanel = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getPersonaById(userId);
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bienvenido, {userData ? userData.nombre : "Cargando..."}</h1>
        <div className="buttons-container">
          <button className="primary-button" onClick={() => setShowModal(true)}>
            Ver Datos
          </button>
          <button className="secondary-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <section className="classes-section">
          <h2>Tus Clases</h2>
          <table className="classes-table">
            <thead>
              <tr>
                <th>Clase</th>
                <th>Días</th>
                <th>Horario</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Crossfit</td>
                <td>Lunes y Miércoles</td>
                <td>6:00 PM</td>
              </tr>
              <tr>
                <td>Yoga</td>
                <td>Martes y Jueves</td>
                <td>7:00 AM</td>
              </tr>
              <tr>
                <td>Zumba</td>
                <td>Viernes</td>
                <td>8:00 PM</td>
              </tr>
            </tbody>
          </table>
          <p className="membership-status">
            <strong>Membresía:</strong> {userData ? "Activa hasta 31/12/2025" : "Cargando..."}
          </p>
        </section>
      </main>

      {/* Modal con los datos del usuario */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Datos del Usuario</h2>
            {userData ? (
              <>
                <p><strong>ID:</strong> {userData.id}</p>
                <p><strong>Nombre:</strong> {userData.nombre}</p>
                <p><strong>Teléfono:</strong> {userData.telefono}</p>
                <p><strong>Fecha:</strong> {userData.fecha}</p>
              </>
            ) : (
              <p>Cargando datos...</p>
            )}
            <button className="close-button" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
