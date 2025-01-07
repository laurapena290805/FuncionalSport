import React, { useState, useEffect } from "react";
import { getPersonaById, getClases } from "./services/api";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./services/firebase"; // Importa la configuración de Firebase
import "./UserPanel.css";

const UserPanel = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndClasses = async () => {
      try {
        const user = await getPersonaById(userId); // Obtiene datos del usuario
        setUserData(user);

        const classes = await getClases(); // Obtiene todas las clases

        // Separar clases registradas y disponibles
        const registered = [];
        const available = [];

        classes.forEach((clase) => {
          if (clase.inscritos.includes(user.nombre)) {
            registered.push(clase);
          } else {
            available.push(clase);
          }
        });

        setRegisteredClasses(registered);
        setAvailableClasses(available);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchUserDataAndClasses();
  }, [userId]);

  const handleAddClass = async (classId) => {
    const selectedClass = availableClasses.find((clase) => clase.id === classId);

    if (selectedClass && userData) {
      try {
        const classRef = doc(db, "clases", classId);

        await updateDoc(classRef, {
          inscritos: arrayUnion(userData.nombre),
        });

        // Actualizar estado local
        setRegisteredClasses([...registeredClasses, selectedClass]);
        setAvailableClasses(availableClasses.filter((clase) => clase.id !== classId));

        console.log(`Usuario ${userData.nombre} registrado en la clase ${classId}`);
      } catch (error) {
        console.error("Error al registrar al usuario en la clase:", error);
      }
    }
  };

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
        {/* Tabla de clases disponibles */}
        <section className="classes-section">
          <h2>Clases Disponibles</h2>
          <table className="classes-table">
            <thead>
              <tr>
                <th>Clase</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {availableClasses.length > 0 ? (
                availableClasses.map((clase) => (
                  <tr key={clase.id}>
                    <td>{clase.nombre}</td>
                    <td>{clase.fecha}</td>
                    <td>{clase.hora}</td>
                    <td>
                      <button
                        className="secondary-button"
                        onClick={() => handleAddClass(clase.id)}
                      >
                        Registrar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay clases disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Clases registradas y membresía en dos columnas */}
        <section className="user-details-section columns">
          <div className="registered-classes">
            <h2>Clases Registradas</h2>
            <table className="classes-table">
              <thead>
                <tr>
                  <th>Clase</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                </tr>
              </thead>
              <tbody>
                {registeredClasses.length > 0 ? (
                  registeredClasses.map((clase) => (
                    <tr key={clase.id}>
                      <td>{clase.nombre}</td>
                      <td>{clase.fecha}</td>
                      <td>{clase.hora}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Aún no estás registrado en ninguna clase.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="membership-status">
            <h2>Estado de la Membresía</h2>
            <p>
              <strong>Membresía:</strong>{" "}
              {userData ? "Activa hasta 31/12/2025" : "Cargando..."}
            </p>
          </div>
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
