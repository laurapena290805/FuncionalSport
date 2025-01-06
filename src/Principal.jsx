import React, { useState, useEffect } from 'react';
import {
  createClase,
  getClases,
  deleteClase,
  updateClase,
} from "./services/api"; // Ajusta la ruta si es necesario
import { createPersona, getPersonas, deletePersona, updatePersona } from "./services/api";

const Principal = () => {
  const [claseId, setClaseId] = useState("");
  const [nombreClase, setNombreClase] = useState("");
  const [fechaClase, setFechaClase] = useState("");
  const [horaClase, setHoraClase] = useState("");
  const [clases, setClases] = useState([]);
  const [filteredClases, setFilteredClases] = useState([]);


  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [personas, setPersonas] = useState([]);
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
    <div>
      {/* Clases del día */}
      <section className="section">
        <h2>Clases del día</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Inscritos</th>
            </tr>
          </thead>
          <tbody>
            {filteredClases.map((clase) => (
              <tr key={clase.id}>
                <td>{clase.nombre}</td>
                <td>{clase.fecha}</td>
                <td>{clase.hora}</td>
                <td>{clase.inscritos?.length || 0}</td> {/* Tamaño del array inscritos */}
                <td>
                  {/* Agrega botones de acciones si es necesario */}
                </td>
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
                <th>Teléfono</th>
                <th>Fecha</th>

              </tr>
            </thead>
            <tbody>
              {filteredPersonas.map((persona) => (
                <tr key={persona.id}>
                  <td>{persona.nombre}</td>
                  <td>{persona.telefono}</td>
                  <td>{persona.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </section>
    </div>
  );
};

export default Principal;
