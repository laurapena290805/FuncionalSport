import { useState, useEffect } from "react";
import {
  createClase,
  getClases,
  deleteClase,
  updateClase,
} from "./services/api"; // Archivo API
import "./Clases.css"; // Opcional, para estilos personalizados

const Clases = () => {
  const [claseId, setClaseId] = useState("");
  const [nombreClase, setNombreClase] = useState("");
  const [fechaClase, setFechaClase] = useState("");
  const [horaClase, setHoraClase] = useState("");
  const [clases, setClases] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredClases, setFilteredClases] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    showClases();
  }, []);

  const showClases = () => {
    getClases().then((data) => {
      setClases(data);
      setFilteredClases(data);
    });
  };

  const handleSaveClase = async () => {
    if (!claseId || !nombreClase || !fechaClase || !horaClase) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const claseData = { nombre: nombreClase, fecha: fechaClase, hora: horaClase };

    if (isEditing) {
      await updateClase(claseId, claseData);
    } else {
      await createClase(claseId, claseData);
    }

    showClases();
    resetForm();
  };

  const handleEditClase = (clase) => {
    setClaseId(clase.id);
    setNombreClase(clase.nombre);
    setFechaClase(clase.fecha);
    setHoraClase(clase.hora);
    setIsEditing(true);
  };

  const handleDeleteClase = async (id) => {
    await deleteClase(id);
    showClases();
  };

  const handleDeleteInscritos = async () => {
    if (!claseId) {
      alert("No hay una clase seleccionada para eliminar inscritos.");
      return;
    }

    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar todos los inscritos de esta clase?"
    );

    if (confirmDelete) {
      try {
        // Actualizamos el array de inscritos de la clase seleccionada
        const updatedClase = {
          nombre: nombreClase,
          fecha: fechaClase,
          hora: horaClase,
          inscritos: [], // Vaciar array de inscritos
        };

        await updateClase(claseId, updatedClase); // Actualizamos la clase en la base de datos
        alert("Todos los inscritos han sido eliminados.");
        showClases(); // Refrescamos las clases
      } catch (error) {
        console.error("Error al eliminar inscritos:", error);
        alert("Hubo un problema al intentar eliminar los inscritos.");
      }
    }
  };

  const handleSearch = () => {
    const results = clases.filter((clase) =>
      clase.id.toString().includes(searchId)
    );
    setFilteredClases(results);
  };

  const handleShowAll = () => {
    setFilteredClases(clases);
    setSearchId("");
  };

  const resetForm = () => {
    setClaseId("");
    setNombreClase("");
    setFechaClase("");
    setHoraClase("");
    setIsEditing(false);
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        <section className="section">
          <h2>Gestión de Clases</h2>

          <div className="search-container">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Buscar por ID"
              className="search-input"
            />
            <button onClick={handleSearch} className="action-button">
              Buscar
            </button>
            <button onClick={handleShowAll} className="action-button">
              Mostrar Todo
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClases.map((clase) => (
                <tr key={clase.id}>
                  <td>{clase.id}</td>
                  <td>{clase.nombre}</td>
                  <td>{clase.fecha}</td>
                  <td>{clase.hora}</td>
                  <td>
                    <button
                      onClick={() => handleEditClase(clase)}
                      className="action-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClase(clase.id)}
                      className="action-button"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="section">
          <h2>{isEditing ? "Editar Clase" : "Agregar Nueva Clase"}</h2>
          <input
            type="text"
            value={claseId}
            onChange={(e) => setClaseId(e.target.value)}
            placeholder="ID"
            className="input-field"
            disabled={isEditing}
          />
          <input
            type="text"
            value={nombreClase}
            onChange={(e) => setNombreClase(e.target.value)}
            placeholder="Nombre"
            className="input-field"
          />
          <input
            type="date"
            value={fechaClase}
            onChange={(e) => setFechaClase(e.target.value)}
            className="input-field"
          />
          <input
            type="time"
            value={horaClase}
            onChange={(e) => setHoraClase(e.target.value)}
            className="input-field"
          />
          <button onClick={handleSaveClase} className="action-button">
            {isEditing ? "Actualizar Clase" : "Insertar Clase"}
          </button>
          {isEditing && (
            <>
              <button onClick={handleDeleteInscritos} className="action-button">
                Eliminar Inscritos
              </button>
              <button onClick={resetForm} className="action-button">
                Cancelar
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Clases;
