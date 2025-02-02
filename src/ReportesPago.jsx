import React, { useState, useEffect } from "react";
import { getPersonas } from "./services/api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ReportesMensuales = () => {
  const [personas, setPersonas] = useState([]);
  const [plan1Efectivo, setPlan1Efectivo] = useState(0);
  const [plan1Transferencia, setPlan1Transferencia] = useState(0);
  const [plan2Efectivo, setPlan2Efectivo] = useState(0);
  const [plan2Transferencia, setPlan2Transferencia] = useState(0);
  const [mesSeleccionado, setMesSeleccionado] = useState("enero");

  const precioPlan1 = 65000;
  const precioPlan2 = 75000;

  useEffect(() => {
    getPersonas().then((data) => {
      setPersonas(data);
      contarPagos(data, mesSeleccionado);
    });
  }, [mesSeleccionado]);

  const contarPagos = (personas, mes) => {
    let plan1Efectivo = 0;
    let plan1Transferencia = 0;
    let plan2Efectivo = 0;
    let plan2Transferencia = 0;

    personas.forEach((persona) => {
      if (persona.pago && persona.pago[mes]) {
        if (persona.plan === "plan1") {
          if (persona.pago[mes] === "efectivo") {
            plan1Efectivo++;
          } else if (persona.pago[mes] === "transferencia") {
            plan1Transferencia++;
          }
        } else if (persona.plan === "plan2") {
          if (persona.pago[mes] === "efectivo") {
            plan2Efectivo++;
          } else if (persona.pago[mes] === "transferencia") {
            plan2Transferencia++;
          }
        }
      }
    });

    setPlan1Efectivo(plan1Efectivo);
    setPlan1Transferencia(plan1Transferencia);
    setPlan2Efectivo(plan2Efectivo);
    setPlan2Transferencia(plan2Transferencia);
  };

  const totalIngresos = (plan1Efectivo + plan1Transferencia) * precioPlan1 + (plan2Efectivo + plan2Transferencia) * precioPlan2;

  const data = {
    labels: ["Plan 1 - Efectivo", "Plan 1 - Transferencia", "Plan 2 - Efectivo", "Plan 2 - Transferencia"],
    datasets: [
      {
        label: "Cantidad de Pagos",
        data: [plan1Efectivo, plan1Transferencia, plan2Efectivo, plan2Transferencia],
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#E91E63"],
      },
    ],
  };

  return (
    <div>
      <h2>Reporte de Pagos</h2>
      <label>Seleccionar Mes: </label>
      <select onChange={(e) => setMesSeleccionado(e.target.value)} value={mesSeleccionado}>
        {["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"].map((mes) => (
          <option key={mes} value={mes}>{mes.charAt(0).toUpperCase() + mes.slice(1)}</option>
        ))}
      </select>

      <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Tipo de Pago</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Plan 1 - Efectivo</td>
            <td>{plan1Efectivo}</td>
            <td>${precioPlan1}</td>
            <td>${plan1Efectivo * precioPlan1}</td>
          </tr>
          <tr>
            <td>Plan 1 - Transferencia</td>
            <td>{plan1Transferencia}</td>
            <td>${precioPlan1}</td>
            <td>${plan1Transferencia * precioPlan1}</td>
          </tr>
          <tr>
            <td>Plan 2 - Efectivo</td>
            <td>{plan2Efectivo}</td>
            <td>${precioPlan2}</td>
            <td>${plan2Efectivo * precioPlan2}</td>
          </tr>
          <tr>
            <td>Plan 2 - Transferencia</td>
            <td>{plan2Transferencia}</td>
            <td>${precioPlan2}</td>
            <td>${plan2Transferencia * precioPlan2}</td>
          </tr>
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan="3">Total Ingresos</td>
            <td>${totalIngresos}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px", width: "80%", margin: "auto" }}>
        <Bar data={data} />
      </div>
    </div>
  );
};

export default ReportesMensuales;
