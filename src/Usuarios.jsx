import { createPersona, getPersonas, deletePersona, updatePersona } from "./services/api";
import { useState, useEffect } from "react";
import "./Usuarios.css";

const Usuarios = () => {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [personas, setPersonas] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredPersonas, setFilteredPersonas] = useState([]);

  useEffect(() => {
    showPersonas();
  }, []);

  const showPersonas = () => {
    getPersonas().then((data) => {
      setPersonas(data);
      setFilteredPersonas(data);
    });
  };

  const handleAddPersona = async () => {
    if (!id || !nombre || !telefono || !fecha) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const personaData = { nombre, telefono, fecha };
    await createPersona(id, personaData);
    showPersonas();
    setId("");
    setNombre("");
    setTelefono("");
    setFecha("");
  };

  const handleDelete = async (personaId) => {
    await deletePersona(personaId);
    showPersonas();
  };

  const handleUpdate = async (personaId) => {
    if (!nombre || !telefono || !fecha) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const personaData = { nombre, telefono, fecha };
    await updatePersona(personaId, personaData);
    showPersonas();
    setId("");
    setNombre("");
    setTelefono("");
    setFecha("");
  };

  const handleSearch = () => {
    const results = personas.filter((persona) =>
      persona.id.toString().includes(searchId)
    );
    setFilteredPersonas(results);
  };

  const handleShowAll = () => {
    setFilteredPersonas(personas);
    setSearchId("");
  };

  return (
    <div className="admin-container">
      

      {/* Main Content */}
      <main className="main-content">
        <section className="section">
          <h2>Gestión de Personas</h2>

          {/* Campo de búsqueda */}
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

          {/* Tabla de personas */}
          <table className="table">
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
              {filteredPersonas.map((persona) => (
                <tr key={persona.id}>
                  <td>{persona.id}</td>
                  <td>{persona.nombre}</td>
                  <td>{persona.telefono}</td>
                  <td>{persona.fecha}</td>
                  <td>
                    <button onClick={() => handleUpdate(persona.id)} className="action-button">Editar</button>
                    <button onClick={() => handleDelete(persona.id)} className="action-button">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Formulario para insertar personas */}
        <section className="section">
          <h2>Agregar Nueva Persona</h2>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="ID"
            className="input-field"
          />
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            className="input-field"
          />
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Teléfono"
            className="input-field"
          />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="input-field"
          />
          <button onClick={handleAddPersona} className="action-button">Insertar Persona</button>
        </section>
      </main>
    </div>
  );
};

export default Usuarios;
