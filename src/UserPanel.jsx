import React, { useState, useEffect } from "react";
import { getPersonaById, getClases } from "./services/api";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./services/firebase"; // Importa la configuración de Firebase
import "./UserPanel.css";

const UserPanel = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]); // Clases disponibles para inscribirse
  const [registeredClasses, setRegisteredClasses] = useState([]); // Clases en las que el usuario está registrado
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndClasses = async () => {
      try {
        const user = await getPersonaById(userId); // Obtiene datos del usuario
        setUserData(user);

        const classes = await getClases(); // Obtiene todas las clases desde la base de datos
        console.log(classes); // Agregar log para ver las clases

        // Separar clases registradas y disponibles
        const registered = [];
        const available = [];

        classes.forEach((clase) => {
          if (clase.inscritos && clase.inscritos.includes(user.nombre)) {
            registered.push(clase); // Si el usuario ya está inscrito en la clase
          } else {
            available.push(clase); // Si la clase está disponible para inscripción
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
          inscritos: arrayUnion(userData.nombre), // Añadir el nombre del usuario a la lista de inscritos
        });

        // Actualizar estado local
        setRegisteredClasses([...registeredClasses, selectedClass]); // Añadir a las clases registradas
        setAvailableClasses(availableClasses.filter((clase) => clase.id !== classId)); // Eliminar de las clases disponibles

        console.log(`Usuario ${userData.nombre} registrado en la clase ${classId}`);
      } catch (error) {
        console.error("Error al registrar al usuario en la clase:", error);
      }
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const getMembershipStatus = () => {
    if (!userData) return { status: "Cargando...", color: "gray", icon: "" };

    const today = new Date();
    const membershipDate = new Date(userData.fecha); // Fecha de vencimiento de la membresía

    // Calcular la diferencia en días entre la fecha de vencimiento y hoy
    const diffDays = Math.ceil((membershipDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        status: `VENCIDA desde ${Math.abs(diffDays)} días`, 
        color: "red", 
        icon: "❌" 
      }; // Fecha ya pasó
    } else if (diffDays <= 10) {
      return { 
        status: `PRÓXIMA A VENCER en ${diffDays} días`, 
        color: "orange", 
        icon: "⚠️" 
      }; // Faltan 10 días o menos
    } else {
      return { 
        status: `AL DÍA con ${diffDays} días restantes`, 
        color: "green", 
        icon: "✔️" 
      }; // Más de 10 días restantes
    }
  };

  const membershipStatus = getMembershipStatus();

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

          <div className="membership-status" style={{
            color: membershipStatus.color,
            backgroundColor: "#f0f4f8", // Fondo más suave
            padding: "30px",
            borderRadius: "15px",
            fontSize: "1.6em",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
            margin: "20px 0",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Sombra sutil
            border: "1px solid #dcdfe6", // Borde suave
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span 
                style={{ 
                  fontSize: "2em", 
                  padding: "5px", 
                  backgroundColor: membershipStatus.color, 
                  borderRadius: "50%", 
                  color: "#fff" 
                }}
              >
                {membershipStatus.icon}
              </span>
              <h2 style={{ margin: 0 }}>Estado de la Membresía</h2>
            </div>

            <p style={{ margin: 0 }}>
              <strong>Membresía:</strong> {membershipStatus.status || "No disponible"}
            </p>
          </div>
        </section>
      </main>

      {/* Modal con los datos del usuario */}
      {showModal && (
        <div className="modaldatos">
          <div className="modaldatos-content">
            <h2>Datos del Usuario</h2>
            {userData ? (
              <>
                <div className="modaldatos-row">
                  <section>
                    <h3>Información Personal</h3>
                    <p><strong>Nombre:</strong> {userData.nombre || "No información"}</p>
                    <p><strong>Teléfono:</strong> {userData.telefono || "No información"}</p>
                    <p><strong>Fecha:</strong> {userData.fecha || "No información"}</p>
                    <p><strong>Dirección:</strong> {userData.direccion || "No información"}</p>
                    <p><strong>Grupo Sanguíneo:</strong> {userData.grupoSanguineo || "No información"}</p>
                    <p><strong>Ocupación:</strong> {userData.ocupacion || "No información"}</p>
                    <p><strong>Talla:</strong> {userData.talla || "No información"}</p>
                    <p><strong>Nivel de Estudio:</strong> {userData.nivelEstudio || "No información"}</p>
                  </section>

                  <section>
                    <h3>Datos de Salud</h3>
                    <p><strong>Familiares:</strong> {userData.familiares ? JSON.stringify(userData.familiares) : "No información"}</p>
                    <p><strong>EPS:</strong> {userData.eps || "No información"}</p>
                    <p><strong>ARL:</strong> {userData.arl || "No información"}</p>
                    <p><strong>Lesiones:</strong> {userData.lesiones || "No información"}</p>
                    <p><strong>Alergias:</strong> {userData.alergias || "No información"}</p>
                    <p><strong>Medicamentos:</strong> {userData.medicamentos || "No información"}</p>
                    <p><strong>Problemas Pulmonares:</strong> {userData.problemasPulmonares ? "Sí" : "No información"}</p>
                    <p><strong>Enfermedades Cardiacas:</strong> {userData.enfermedadesCardiacas ? "Sí" : "No información"}</p>
                    <p><strong>Enfermedad Renal:</strong> {userData.enfermedadRenal ? "Sí" : "No información"}</p>
                    <p><strong>Sistema Inmunitario Debilitado:</strong> {userData.sistemaInmunitarioDebilitado ? "Sí" : "No información"}</p>
                  </section>
                </div>

                <div className="modaldatos-row">
                  <section className="modaldatos-plan">
                    <h3>Detalles del Plan</h3>
                    <p><strong>Plan:</strong> {userData.plan || "No información"}</p>
                    <p><strong>Días Seleccionados:</strong> 
                      {userData.diasSeleccionados && userData.diasSeleccionados.length > 0 
                        ? userData.diasSeleccionados.join(", ") 
                        : "Todos los días"}
                    </p>
                  </section>
                </div>

                <div className="modaldatos-row modaldatos-button-row">
                  <button className="modaldatos-close-button" onClick={() => setShowModal(false)}>
                    Cerrar
                  </button>
                </div>
              </>
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
