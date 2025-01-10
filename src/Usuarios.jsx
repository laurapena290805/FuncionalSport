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
  
  const [plan, setPlan] = useState("plan1");
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPersonaId, setEditPersonaId] = useState("");
  const [isAddingPersona, setIsAddingPersona] = useState(false); // Nueva variable para saber si estamos agregando o editando
  const [isEditing, setIsEditing] = useState(false); // Variable para saber si estamos editando

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

    // Sumamos 1 mes a la fecha proporcionada
    const fechaObj = new Date(fecha);
    fechaObj.setMonth(fechaObj.getMonth() + 1);
    const nuevaFecha = fechaObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const personaData = {
      nombre,
      telefono,
      fecha: nuevaFecha,
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
      plan,
      diasSeleccionados,
      mensualidad, // Mensualidad por defecto
    };

    await createPersona(id, personaData);
    showPersonas();
    resetFields();
    setIsAddingPersona(false); // Cerrar formulario después de agregar
  };

  const handleDelete = async (personaId) => {
    await deletePersona(personaId);
    showPersonas();
  };

  const handleUpdate = async () => {
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
      plan,
      diasSeleccionados,
    };

    await updatePersona(editPersonaId, personaData);
    showPersonas();
    resetFields();
    setIsModalOpen(false);
    setIsEditing(false); // Cambiar el estado para indicar que ya no estamos editando
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
    setPlan("plan1");
    setDiasSeleccionados([]);
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
    setPlan(persona.plan);
    setDiasSeleccionados(persona.diasSeleccionados);
    setEditPersonaId(persona.id);
    setIsModalOpen(true);
    setIsEditing(true); // Cambiar el estado para saber que estamos editando
  };

  const handleSearch = () => {
    const filtered = personas.filter((persona) => persona.id.includes(searchId));
    setFilteredPersonas(filtered);
  };

  const handleShowAll = () => {
    setFilteredPersonas(personas);
  };

  const handlePlanChange = (e) => {
    setPlan(e.target.value);
    if (e.target.value === "plan2") {
      setDiasSeleccionados([]);
    }
  };

  const handleDiaChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDiasSeleccionados([...diasSeleccionados, value]);
    } else {
      setDiasSeleccionados(diasSeleccionados.filter((dia) => dia !== value));
    }
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

          <button onClick={() => { setIsAddingPersona(true); setIsEditing(false); }} className="action-button">Agregar Persona</button>

          {(isAddingPersona || isEditing) && (
            <section className="section">
              <h2>{isEditing ? "Editar Persona" : "Agregar Nueva Persona"}</h2>
              <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" className="input-field" />
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="input-field" />
              <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="input-field" />
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="input-field" />
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" className="input-field" />
              <input type="text" value={grupoSanguineo} onChange={(e) => setGrupoSanguineo(e.target.value)} placeholder="Grupo Sanguíneo" className="input-field" />
              <input type="text" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)} placeholder="Ocupación" className="input-field" />
              <input type="text" value={talla} onChange={(e) => setTalla(e.target.value)} placeholder="Talla" className="input-field" />
              <input type="text" value={nivelEstudio} onChange={(e) => setNivelEstudio(e.target.value)} placeholder="Nivel de Estudio" className="input-field" />

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
              <button onClick={isEditing ? handleUpdate : handleAddPersona} className="action-button">
                {isEditing ? "Actualizar Persona" : "Agregar Persona"}
              </button>
            </section>
          )}
        </section>
      </main>
    </div>
  );
};

export default Usuarios;
