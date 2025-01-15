import React, { useState, useEffect } from "react";
import { createPersona, getPersonas, deletePersona, updatePersona } from "./services/api";
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

  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [pago, setPago] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPersonaId, setEditPersonaId] = useState("");
  const [isAddingPersona, setIsAddingPersona] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
  
    // Guardar la fecha original proporcionada por el usuario
    const fechaUsuario = new Date(fecha);
  
    // Obtener el mes en formato textual y en minúsculas
    const mesPago = fechaUsuario.toLocaleString("es-ES", { month: "long" }).toLowerCase();
  
    // Primero, actualizar el mapa de pagos con el mes del usuario
    const updatedPago = { ...pago, [mesPago]: metodoPago };
  
    // Sumar un mes a la fecha proporcionada
    fechaUsuario.setMonth(fechaUsuario.getMonth() + 1);
  
    // Convertir la fecha a string en formato "YYYY-MM-DD" después de agregar el mes
    const fechaConMesSumado = fechaUsuario.toISOString().split('T')[0];
  
    // Crear el objeto persona con la información
    const personaData = {
      nombre, telefono, fecha: fechaConMesSumado, direccion, grupoSanguineo, ocupacion, talla, nivelEstudio, eps, arl, lesiones, alergias, medicamentos,
      problemasPulmonares, enfermedadesCardiacas, enfermedadRenal, sistemaInmunitarioDebilitado, plan, diasSeleccionados, pago: updatedPago,
      mensualidad: false,  // Establecer mensualidad como false al agregar
    };
  
    // Crear la persona en la base de datos
    await createPersona(id, personaData);
    showPersonas();
    resetFields();
    setIsAddingPersona(false); 
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
    const mesPago = new Date(fecha).toLocaleString("es-ES", { month: "long" }).toLowerCase();
    const updatedPago = { ...pago, [mesPago]: metodoPago };

    const personaData = {
      nombre, telefono, fecha, direccion, grupoSanguineo, ocupacion, talla, nivelEstudio, eps, arl, lesiones, alergias, medicamentos,
      problemasPulmonares, enfermedadesCardiacas, enfermedadRenal, sistemaInmunitarioDebilitado, plan, diasSeleccionados, pago: updatedPago,
    };

    await updatePersona(editPersonaId, personaData);
    showPersonas();
    resetFields();
    setIsModalOpen(false);
    setIsEditing(false); 
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
    setMetodoPago("transferencia");
    setPago({});
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
    setMetodoPago(persona.pago ? Object.values(persona.pago)[0] : "transferencia");
    setPago(persona.pago || {});
    setEditPersonaId(persona.id);
    setIsModalOpen(true);
    setIsEditing(true);
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
          <div className="button-container">
            <button onClick={() => { setIsAddingPersona(true); setIsEditing(false); }} className="action-button">Agregar Persona</button>
          </div>
          {(isAddingPersona || isEditing) && (
            <section className="section">
              <h2>{isEditing ? "Editar Persona" : "Agregar Nueva Persona"}</h2>

              <div className="form-grild">
                  <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" className="input-field" disabled={isEditing} />
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="input-field" disabled={isEditing}/>
                  <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="input-field" />
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="input-field" disabled={isEditing}/>
                  <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" className="input-field" />
                  <input type="text" value={grupoSanguineo} onChange={(e) => setGrupoSanguineo(e.target.value)} placeholder="Grupo Sanguíneo" className="input-field" />
                  <input type="text" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)} placeholder="Ocupación" className="input-field" />
                  <input type="text" value={talla} onChange={(e) => setTalla(e.target.value)} placeholder="Talla" className="input-field" />
                  <input type="text" value={nivelEstudio} onChange={(e) => setNivelEstudio(e.target.value)} placeholder="Nivel de Estudio" className="input-field" />
                  <input type="text" value={eps} onChange={(e) => setEps(e.target.value)} placeholder="EPS" className="input-field" />
                  <input type="text" value={arl} onChange={(e) => setArl(e.target.value)} placeholder="ARL" className="input-field" />
                  <input type="text" value={lesiones} onChange={(e) => setLesiones(e.target.value)} placeholder="Lesiones" className="input-field" />
                  <input type="text" value={alergias} onChange={(e) => setAlergias(e.target.value)} placeholder="Alergias" className="input-field" />
                  <input type="text" value={medicamentos} onChange={(e) => setMedicamentos(e.target.value)} placeholder="Medicamentos" className="input-field" />
              </div>

              <div>
              <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  disabled={isEditing} // Desactivado al editar
                >
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo</option>
                </select>
              </div>

              <div className="form-section">
              <label>
                <input type="checkbox" checked={problemasPulmonares} onChange={(e) => setProblemasPulmonares(e.target.checked)} />
                Problemas pulmonares
              </label>
              <label>
                <input type="checkbox" checked={enfermedadesCardiacas} onChange={(e) => setEnfermedadesCardiacas(e.target.checked)} />
                Enfermedades cardíacas
              </label>
              <label>
                <input type="checkbox" checked={enfermedadRenal} onChange={(e) => setEnfermedadRenal(e.target.checked)} />
                Enfermedad renal
              </label>
              <label>
                <input type="checkbox" checked={sistemaInmunitarioDebilitado} onChange={(e) => setSistemaInmunitarioDebilitado(e.target.checked)} />
                Sistema inmunitario debilitado
              </label>
              </div>
              <div className="form-plan">
                <select value={plan} onChange={handlePlanChange} className="select-field">
                  <option value="plan1">Plan 1</option>
                  <option value="plan2">Plan 2</option>
                </select>

                {plan === "plan1" && (
                  <div className="checkbox-group" disabled={isEditing} >
                    <label>
                      <input
                        type="checkbox"
                        value="Lunes"
                        checked={diasSeleccionados.includes("Lunes")}
                        onChange={handleDiaChange}
                      />
                      Lunes
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Martes"
                        checked={diasSeleccionados.includes("Martes")}
                        onChange={handleDiaChange}
                      />
                      Martes
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Miércoles"
                        checked={diasSeleccionados.includes("Miércoles")}
                        onChange={handleDiaChange}
                      />
                      Miércoles
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Jueves"
                        checked={diasSeleccionados.includes("Jueves")}
                        onChange={handleDiaChange}
                      />
                      Jueves
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Viernes"
                        checked={diasSeleccionados.includes("Viernes")}
                        onChange={handleDiaChange}
                      />
                      Viernes
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Sábado"
                        checked={diasSeleccionados.includes("Sábado")}
                        onChange={handleDiaChange}
                      />
                      Sábado
                    </label>
                  </div>
                )}
              </div>
              <div className="button-container">
              <button onClick={isEditing ? handleUpdate : handleAddPersona} className="action-button">{isEditing ? "Actualizar" : "Agregar"}</button>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
};

export default Usuarios;
