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

  useEffect(() => {
    showClases();
    showPersonas();
  }, []);

  // Mostrar clases
  const showClases = () => {
    getClases().then((data) => {
      setClases(data);
      setFilteredClases(data);
    });
  };

  // Mostrar personas
  const showPersonas = () => {
    getPersonas().then((data) => {
      setPersonas(data);
      updateMensualidades(data); // Actualizar mensualidades de las personas
    });
  };

  // Actualizar mensualidad de personas próximas a vencer
  const updateMensualidades = async (data) => {
    const today = new Date();

    const updatedPersonas = await Promise.all(
      data.map(async (persona) => {
        const vencimiento = new Date(persona.fecha); // Convertir fecha de string a Date
        const diferenciaDias = Math.ceil(
          (vencimiento - today) / (1000 * 60 * 60 * 24)
        ); // Diferencia en días

        // Validar si está dentro de los 10 días antes, el mismo día o hasta 5 días después
        const isCloseToExpiry =
          diferenciaDias >= -10 &&
          diferenciaDias <= 5 &&
          (vencimiento.getMonth() === today.getMonth() ||
            vencimiento.getMonth() === today.getMonth() + 1 ||
            (vencimiento.getMonth() === 0 && today.getMonth() === 11)); // Caso especial para diciembre-enero

        if (isCloseToExpiry && !persona.mensualidad) {
          const updatedPersona = { ...persona, mensualidad: true };
          await updatePersona(persona.id, updatedPersona); // Actualizar en la base de datos
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

    // Agregar un mes a la fecha
    const nuevaFecha = new Date(persona.fecha);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);

    // Mes del pago (antes de la nueva fecha)
    const mesPago = new Date(persona.fecha).toLocaleString("es-ES", { month: "long" });

    // Convertir la nueva fecha a un string en formato YYYY-MM-DD
    const fechaString = nuevaFecha.toISOString().split("T")[0];

    // Crear un nuevo objeto de pago donde el nombre del campo es el mes y el valor es el metodoPago
    const updatedPago = {
      ...persona.pago, // Mantener los pagos anteriores
      [mesPago]: metodoPago, // El campo es el mes y el valor es el metodoPago
    };

    // Actualizar el atributo "mensualidad" a false, "fecha" y registrar el pago
    const updatedPersona = {
      ...persona,
      mensualidad: false,
      fecha: fechaString,
      pago: updatedPago, // Se asigna el nuevo objeto de pago
    };

    await updatePersona(personaId, updatedPersona); // Actualizar en la base de datos

    // Actualizar la lista de personas después del pago
    const updatedPersonas = personas.map((p) =>
      p.id === personaId ? updatedPersona : p
    );
    setPersonas(updatedPersonas);
    setFilteredPersonas(
      updatedPersonas.filter((p) => p.mensualidad === true)
    );
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
                <td>{clase.inscritos?.length || 0}</td>
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
    </div>
  );
};

export default Principal;
