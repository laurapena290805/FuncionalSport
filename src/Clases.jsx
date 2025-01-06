import { useState, useEffect } from "react";
import {
  createClase,
  getClases,
  deleteClase,
  updateClase,
} from "./services/api"; // Asegúrate de que estos métodos estén correctamente definidos en tu archivo API
import "./Clases.css"; // Opcional, para estilos personalizados

const Clases = () => {
  const [claseId, setClaseId] = useState("");
  const [nombreClase, setNombreClase] = useState("");
  const [fechaClase, setFechaClase] = useState("");
  const [horaClase, setHoraClase] = useState("");
  const [clases, setClases] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredClases, setFilteredClases] = useState([]);

  useEffect(() => {
    showClases();
  }, []);

  const showClases = () => {
    getClases().then((data) => {
      setClases(data);
      setFilteredClases(data);
    });
  };

  const handleAddClase = async () => {
    if (!claseId || !nombreClase || !fechaClase || !horaClase) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const claseData = { nombre: nombreClase, fecha: fechaClase, hora: horaClase };
    await createClase(claseId, claseData);
    showClases();
    setClaseId("");
    setNombreClase("");
    setFechaClase("");
    setHoraClase("");
  };

  const handleDeleteClase = async (id) => {
    await deleteClase(id);
    showClases();
  };

  const handleUpdateClase = async (id) => {
    if (!nombreClase || !fechaClase || !horaClase) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const claseData = { nombre: nombreClase, fecha: fechaClase, hora: horaClase };
    await updateClase(id, claseData);
    showClases();
    setClaseId("");
    setNombreClase("");
    setFechaClase("");
    setHoraClase("");
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
            <button onClick={handleSearch} className="action-button">Buscar</button>
            <button onClick={handleShowAll} className="action-button">Mostrar Todo</button>
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
                    <button onClick={() => handleUpdateClase(clase.id)} className="action-button">Editar</button>
                    <button onClick={() => handleDeleteClase(clase.id)} className="action-button">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="section">
          <h2>Agregar Nueva Clase</h2>
          <input
            type="text"
            value={claseId}
            onChange={(e) => setClaseId(e.target.value)}
            placeholder="ID"
            className="input-field"
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
          <button onClick={handleAddClase} className="action-button">Insertar Clase</button>
        </section>
      </main>
    </div>
  );
};

export default Clases;
