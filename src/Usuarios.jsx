import { createPersona, getPersonas, deletePersona, updatePersona } from "./services/api";
import { useState, useEffect } from "react";
import "./Usuarios.css";

const Usuarios = () => {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [direccion, setDireccion] = useState("");
  const [grupoSanguineo, setGrupoSanguineo] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [talla, setTalla] = useState("");
  const [nivelEstudio, setNivelEstudio] = useState("");
  const [familiares, setFamiliares] = useState({});
  const [eps, setEps] = useState("");
  const [arl, setArl] = useState("");
  const [lesiones, setLesiones] = useState("");
  const [alergias, setAlergias] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [problemasPulmonares, setProblemasPulmonares] = useState(false);
  const [enfermedadesCardiacas, setEnfermedadesCardiacas] = useState(false);
  const [enfermedadRenal, setEnfermedadRenal] = useState(false);
  const [sistemaInmunitarioDebilitado, setSistemaInmunitarioDebilitado] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredPersonas, setFilteredPersonas] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPersonaId, setEditPersonaId] = useState("");

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
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const personaData = {
      nombre,
      telefono,
      fecha,
      direccion,
      grupoSanguineo,
      ocupacion,
      talla,
      nivelEstudio,
      familiares,
      eps,
      arl,
      lesiones,
      alergias,
      medicamentos,
      problemasPulmonares,
      enfermedadesCardiacas,
      enfermedadRenal,
      sistemaInmunitarioDebilitado,
    };

    await createPersona(id, personaData);
    showPersonas();
    resetFields();
  };

  const handleDelete = async (personaId) => {
    await deletePersona(personaId);
    showPersonas();
  };

  const handleUpdate = async (personaId) => {
    if (!nombre || !telefono || !fecha) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const personaData = {
      nombre,
      telefono,
      fecha,
      direccion,
      grupoSanguineo,
      ocupacion,
      talla,
      nivelEstudio,
      familiares,
      eps,
      arl,
      lesiones,
      alergias,
      medicamentos,
      problemasPulmonares,
      enfermedadesCardiacas,
      enfermedadRenal,
      sistemaInmunitarioDebilitado,
    };

    await updatePersona(personaId, personaData);
    showPersonas();
    resetFields();
    setIsModalOpen(false);
  };

  const resetFields = () => {
    setId("");
    setNombre("");
    setTelefono("");
    setFecha("");
    setDireccion("");
    setGrupoSanguineo("");
    setOcupacion("");
    setTalla("");
    setNivelEstudio("");
    setFamiliares({});
    setEps("");
    setArl("");
    setLesiones("");
    setAlergias("");
    setMedicamentos("");
    setProblemasPulmonares(false);
    setEnfermedadesCardiacas(false);
    setEnfermedadRenal(false);
    setSistemaInmunitarioDebilitado(false);
  };

  const openEditModal = (persona) => {
    setId(persona.id);
    setNombre(persona.nombre);
    setTelefono(persona.telefono);
    setFecha(persona.fecha);
    setDireccion(persona.direccion);
    setGrupoSanguineo(persona.grupoSanguineo);
    setOcupacion(persona.ocupacion);
    setTalla(persona.talla);
    setNivelEstudio(persona.nivelEstudio);
    setFamiliares(persona.familiares);
    setEps(persona.eps);
    setArl(persona.arl);
    setLesiones(persona.lesiones);
    setAlergias(persona.alergias);
    setMedicamentos(persona.medicamentos);
    setProblemasPulmonares(persona.problemasPulmonares);
    setEnfermedadesCardiacas(persona.enfermedadesCardiacas);
    setEnfermedadRenal(persona.enfermedadRenal);
    setSistemaInmunitarioDebilitado(persona.sistemaInmunitarioDebilitado);
    setEditPersonaId(persona.id);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    const filtered = personas.filter((persona) => persona.id.includes(searchId));
    setFilteredPersonas(filtered);
  };

  const handleShowAll = () => {
    setFilteredPersonas(personas);
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        <section className="section">
          <h2>Gestión de Personas</h2>

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
                <th>Teléfono</th>
                <th>Fecha</th>
                <th>Dirección</th>
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
                  <td>{persona.direccion}</td>
                  <td>
                    <button onClick={() => openEditModal(persona)} className="action-button">Editar</button>
                    <button onClick={() => handleDelete(persona.id)} className="action-button">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="section">
  <h2>Agregar Nueva Persona</h2>
  <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" className="input-field" />
  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="input-field" />
  <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="input-field" />
  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="input-field" />
  <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" className="input-field" />
  <input type="text" value={grupoSanguineo} onChange={(e) => setGrupoSanguineo(e.target.value)} placeholder="Grupo Sanguíneo" className="input-field" />
  <input type="text" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)} placeholder="Ocupación" className="input-field" />
  <input type="text" value={talla} onChange={(e) => setTalla(e.target.value)} placeholder="Talla" className="input-field" />
  <input type="text" value={nivelEstudio} onChange={(e) => setNivelEstudio(e.target.value)} placeholder="Nivel de Estudio" className="input-field" />
  <input type="text" value={eps} onChange={(e) => setEps(e.target.value)} placeholder="EPS" className="input-field" />
  <input type="text" value={arl} onChange={(e) => setArl(e.target.value)} placeholder="ARL" className="input-field" />
  
  <div className="inputs-container">
    <div className="textarea-container">
      <textarea value={lesiones} onChange={(e) => setLesiones(e.target.value)} placeholder="Lesiones" className="textarea-field"></textarea>
      <textarea value={alergias} onChange={(e) => setAlergias(e.target.value)} placeholder="Alergias" className="textarea-field"></textarea>
      <textarea value={medicamentos} onChange={(e) => setMedicamentos(e.target.value)} placeholder="Medicamentos" className="textarea-field"></textarea>
    </div>
    <div className="checkbox-container">
      <label>
        <input type="checkbox" checked={problemasPulmonares} onChange={(e) => setProblemasPulmonares(e.target.checked)} /> Problemas Pulmonares
      </label>
      <label>
        <input type="checkbox" checked={enfermedadesCardiacas} onChange={(e) => setEnfermedadesCardiacas(e.target.checked)} /> Enfermedades Cardiacas
      </label>
      <label>
        <input type="checkbox" checked={enfermedadRenal} onChange={(e) => setEnfermedadRenal(e.target.checked)} /> Enfermedad Renal
      </label>
      <label>
        <input type="checkbox" checked={sistemaInmunitarioDebilitado} onChange={(e) => setSistemaInmunitarioDebilitado(e.target.checked)} /> Sistema Inmunitario Debilitado
      </label>
    </div>
  </div>

  <button onClick={handleAddPersona} className="action-button">Agregar Persona</button>
</section>

      </main>

      {/* Modal de edición */}
      {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>Editar Persona</h2>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID"
        className="input-field"
        disabled
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
      <input
        type="text"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder="Dirección"
        className="input-field"
      />
      <input
        type="text"
        value={grupoSanguineo}
        onChange={(e) => setGrupoSanguineo(e.target.value)}
        placeholder="Grupo Sanguíneo"
        className="input-field"
      />
      <input
        type="text"
        value={ocupacion}
        onChange={(e) => setOcupacion(e.target.value)}
        placeholder="Ocupación"
        className="input-field"
      />
      <input
        type="text"
        value={talla}
        onChange={(e) => setTalla(e.target.value)}
        placeholder="Talla"
        className="input-field"
      />
      <input
        type="text"
        value={nivelEstudio}
        onChange={(e) => setNivelEstudio(e.target.value)}
        placeholder="Nivel de Estudio"
        className="input-field"
      />
      <input
        type="text"
        value={eps}
        onChange={(e) => setEps(e.target.value)}
        placeholder="EPS"
        className="input-field"
      />
      <input
        type="text"
        value={arl}
        onChange={(e) => setArl(e.target.value)}
        placeholder="ARL"
        className="input-field"
      />
      <textarea
        value={lesiones}
        onChange={(e) => setLesiones(e.target.value)}
        placeholder="Lesiones"
        className="textarea-field"
      />
      <textarea
        value={alergias}
        onChange={(e) => setAlergias(e.target.value)}
        placeholder="Alergias"
        className="textarea-field"
      />
      <textarea
        value={medicamentos}
        onChange={(e) => setMedicamentos(e.target.value)}
        placeholder="Medicamentos"
        className="textarea-field"
      />
      <label>
        <input
          type="checkbox"
          checked={problemasPulmonares}
          onChange={(e) => setProblemasPulmonares(e.target.checked)}
        />{" "}
        Problemas Pulmonares
      </label>
      <label>
        <input
          type="checkbox"
          checked={enfermedadesCardiacas}
          onChange={(e) => setEnfermedadesCardiacas(e.target.checked)}
        />{" "}
        Enfermedades Cardiacas
      </label>
      <label>
        <input
          type="checkbox"
          checked={enfermedadRenal}
          onChange={(e) => setEnfermedadRenal(e.target.checked)}
        />{" "}
        Enfermedad Renal
      </label>
      <label>
        <input
          type="checkbox"
          checked={sistemaInmunitarioDebilitado}
          onChange={(e) => setSistemaInmunitarioDebilitado(e.target.checked)}
        />{" "}
        Sistema Inmunitario Debilitado
      </label>
      <button
        onClick={() => handleUpdate(editPersonaId)}
        className="action-button"
      >
        Guardar Cambios
      </button>
      <button onClick={() => setIsModalOpen(false)} className="action-button">
        Cerrar
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Usuarios;
