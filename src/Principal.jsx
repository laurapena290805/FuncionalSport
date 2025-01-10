import React, { useState, useEffect } from "react";
import {
  createClase,
  getClases,
  deleteClase,
  updateClase,
} from "./services/api";
import { createPersona, getPersonas, updatePersona } from "./services/api";
import "./Principal.css";

const Principal = () => {
  const [clases, setClases] = useState([]);
  const [filteredClases, setFilteredClases] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inscritosClase, setInscritosClase] = useState([]);

  useEffect(() => {
    showClases();
    showPersonas();
  }, []);

  const showClases = () => {
    getClases().then((data) => {
      setClases(data);
      setFilteredClases(data);
    });
  };

  const showPersonas = () => {
    getPersonas().then((data) => {
      setPersonas(data);
      updateMensualidades(data);
    });
  };

  const updateMensualidades = async (data) => {
    const today = new Date();
    const updatedPersonas = await Promise.all(
      data.map(async (persona) => {
        const vencimiento = new Date(persona.fecha);
        const diferenciaDias = Math.ceil(
          (vencimiento - today) / (1000 * 60 * 60 * 24)
        );
        const isCloseToExpiry =
          diferenciaDias >= -10 &&
          diferenciaDias <= 5 &&
          (vencimiento.getMonth() === today.getMonth() ||
            vencimiento.getMonth() === today.getMonth() + 1 ||
            (vencimiento.getMonth() === 0 && today.getMonth() === 11));
        if (isCloseToExpiry && !persona.mensualidad) {
          const updatedPersona = { ...persona, mensualidad: true };
          await updatePersona(persona.id, updatedPersona);
          return updatedPersona;
        }
        return persona;
      })
    );
    setPersonas(updatedPersonas);
    setFilteredPersonas(updatedPersonas.filter((persona) => persona.mensualidad));
  };

  const handlePago = async (personaId, metodoPago) => {
    const persona = personas.find((p) => p.id === personaId);
    if (!persona) return;

    const nuevaFecha = new Date(persona.fecha);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    const mesPago = new Date(persona.fecha).toLocaleString("es-ES", { month: "long" });
    const fechaString = nuevaFecha.toISOString().split("T")[0];

    const updatedPago = {
      ...persona.pago,
      [mesPago]: metodoPago,
    };

    const updatedPersona = {
      ...persona,
      mensualidad: false,
      fecha: fechaString,
      pago: updatedPago,
    };

    await updatePersona(personaId, updatedPersona);
    const updatedPersonas = personas.map((p) =>
      p.id === personaId ? updatedPersona : p
    );
    setPersonas(updatedPersonas);
    setFilteredPersonas(
      updatedPersonas.filter((p) => p.mensualidad === true)
    );
  };

  const handleVerInscritos = (clase) => {
    // Los inscritos son un array de nombres de personas
    setInscritosClase(clase.inscritos || []); // Aseguramos que sea un array vacío si no hay inscritos
    setModalVisible(true); // Abre el modal
  };

  const closeModal = () => {
    setModalVisible(false); // Cierra el modal
  };

  return (
    <div>
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
                <td>
                  {clase.inscritos?.length || 0}{" "}
                  <button
                    onClick={() => handleVerInscritos(clase)}
                    className="btn btn-info"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Mensualidades a vencer</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersonas.length > 0 ? (
              filteredPersonas.map((persona) => (
                <tr key={persona.id}>
                  <td>{persona.nombre}</td>
                  <td>{persona.telefono}</td>
                  <td>{persona.fecha}</td>
                  <td>
                    <button
                      onClick={() => handlePago(persona.id, "Efectivo")}
                      className="btn btn-success"
                    >
                      Pago en Efectivo
                    </button>
                    <button
                      onClick={() => handlePago(persona.id, "Transferencia")}
                      className="btn btn-primary"
                    >
                      Pago por Transferencia
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay mensualidades próximas a vencer</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Modal para mostrar inscritos */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Inscritos en la clase</h3>
            <ul>
              {inscritosClase.length > 0 ? (
                inscritosClase.map((inscrito, index) => (
                  <li key={index}>{inscrito}</li> // Aquí renderizamos el nombre directamente
                ))
              ) : (
                <li>No hay inscritos en esta clase.</li>
              )}
            </ul>
            <button onClick={closeModal} className="btn btn-close">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Principal;
