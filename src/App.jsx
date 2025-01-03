import { createPersona, getPersonas, deletePersona, updatePersona, getPersonaById } from "./services/api";
import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [personas, setPersonas] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [editData, setEditData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = () => {
    getPersonas().then(data => setPersonas(data));
  };

  const searchPersonaById = async () => {
    if (!searchId) {
      alert("Por favor, ingresa un ID para buscar.");
      return;
    }
    const persona = await getPersonaById(searchId);
    if (persona) {
      setPersonas([{ id: searchId, ...persona }]);
    } else {
      alert("No se encontró ninguna persona con ese ID.");
      setPersonas([]);
    }
  };

  const handleAddPersona = async () => {
    if (!id || !nombre || !telefono || !fecha) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    await createPersona({ id, nombre, telefono, fecha });
    setShowAddModal(false);
    fetchPersonas();
    setId("");
    setNombre("");
    setTelefono("");
    setFecha("");
  };

  const handleEditSubmit = async () => {
    if (editData) {
      await updatePersona(editData.id, {
        nombre: editData.nombre,
        telefono: editData.telefono,
        fecha: editData.fecha,
      });
      setEditData(null);
      fetchPersonas();
    }
  };

  const handleDelete = async (id) => {
    await deletePersona(id);
    fetchPersonas();
  };

  return (
    <div className="container">
      <h1>Gestión de Personas</h1>

      <div className="search-bar">
        <input
          type="text"
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Buscar por ID"
        />
        <button onClick={searchPersonaById}>Buscar</button>
        <button onClick={fetchPersonas}>Mostrar Todo</button>
        <button onClick={() => setShowAddModal(true)}>Añadir Persona</button>
      </div>

      <table className="personas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas?.map((persona) => (
            <tr key={persona.id}>
              <td>{persona.id}</td>
              <td>{persona.nombre}</td>
              <td>{persona.telefono}</td>
              <td>{persona.fecha}</td>
              <td>
                <button onClick={() => setEditData(persona)}>Editar</button>
                <button onClick={() => handleDelete(persona.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Añadir */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Añadir Persona</h2>
            <label>ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="ID único"
            />
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
            />
            <label>Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono"
            />
            <label>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <button onClick={handleAddPersona}>Añadir</button>
            <button onClick={() => setShowAddModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {editData && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Persona</h2>
            <label>ID</label>
            <input type="text" value={editData.id} disabled />
            <label>Nombre</label>
            <input
              type="text"
              value={editData.nombre}
              onChange={(e) =>
                setEditData({ ...editData, nombre: e.target.value })
              }
            />
            <label>Teléfono</label>
            <input
              type="text"
              value={editData.telefono}
              onChange={(e) =>
                setEditData({ ...editData, telefono: e.target.value })
              }
            />
            <label>Fecha</label>
            <input
              type="date"
              value={editData.fecha}
              onChange={(e) =>
                setEditData({ ...editData, fecha: e.target.value })
              }
            />
            <button onClick={handleEditSubmit}>Guardar Cambios</button>
            <button onClick={() => setEditData(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
