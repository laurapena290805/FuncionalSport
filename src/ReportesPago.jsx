import React, { useState, useEffect } from "react";
import { getPersonas } from "./services/api"; // Asegúrate de que esta función esté importada correctamente
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportesPago = () => {
  const [personas, setPersonas] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [estadisticas, setEstadisticas] = useState({});

  useEffect(() => {
    // Obtener las personas al cargar la página
    getPersonas().then((data) => {
      setPersonas(data);
    });
  }, []);

  // Manejar el cambio en la selección del mes
  const handleMesChange = (event) => {
    setMesSeleccionado(event.target.value);
    procesarEstadisticas(event.target.value);
  };

  // Procesar las estadísticas por mes y método de pago
  const procesarEstadisticas = (mes) => {
    const stats = {
      plan1: { Efectivo: 0, Transferencia: 0, ganancia: 0, precio: 65000 },
      plan2: { Efectivo: 0, Transferencia: 0, ganancia: 0, precio: 75000 },
      metodosPago: { Efectivo: 0, Transferencia: 0 },
    };

    const plan1Precio = 65000; // Precio de Plan 1 (ajusta según sea necesario)
    const plan2Precio = 75000; // Precio de Plan 2 (ajusta según sea necesario)

    personas.forEach((persona) => {
      // Verificar si el mes está presente en los pagos
      if (persona.pago && persona.pago[mes]) {
        const metodoPago = persona.pago[mes];
        const plan = persona.plan; // Asumimos que cada persona tiene un campo "plan" que indica a qué plan pertenece

        if (plan) {
          // Si la persona pertenece a un plan, incrementar el contador correspondiente
          if (metodoPago === "Efectivo") {
            stats[plan].Efectivo += 1;
            stats.metodosPago.Efectivo += 1;
          } else if (metodoPago === "Transferencia") {
            stats[plan].Transferencia += 1;
            stats.metodosPago.Transferencia += 1;
          }
        }
      }
    });

    // Calcular las ganancias por plan
    stats.plan1.ganancia = (stats.plan1.Efectivo + stats.plan1.Transferencia) * plan1Precio;
    stats.plan2.ganancia = (stats.plan2.Efectivo + stats.plan2.Transferencia) * plan2Precio;

    setEstadisticas(stats); // Actualizar el estado con las estadísticas calculadas
  };

  // Datos para los gráficos
  const dataPlanes = {
    labels: ["Plan 1", "Plan 2"],
    datasets: [
      {
        label: "Número de Personas",
        data: [
          estadisticas.plan1?.Efectivo + estadisticas.plan1?.Transferencia || 0,
          estadisticas.plan2?.Efectivo + estadisticas.plan2?.Transferencia || 0
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const dataMetodosPago = {
    labels: ["Efectivo", "Transferencia"],
    datasets: [
      {
        label: "Método de Pago",
        data: [estadisticas.metodosPago?.Efectivo || 0, estadisticas.metodosPago?.Transferencia || 0],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
      },
    ],
  };

  // Calcular el total de ganancias
  const totalGanancias = (estadisticas.plan1?.ganancia || 0) + (estadisticas.plan2?.ganancia || 0);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Estadísticas de Pagos</h2>

      {/* Selector de mes */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="mes">Selecciona un mes:</label>
        <select
          id="mes"
          value={mesSeleccionado}
          onChange={handleMesChange}
          style={{ padding: "5px 10px", fontSize: "16px" }}
        >
          <option value="">-- Elige un mes --</option>
          <option value="enero">Enero</option>
          <option value="febrero">Febrero</option>
          <option value="marzo">Marzo</option>
          <option value="abril">Abril</option>
          {/* Agrega más opciones para los demás meses */}
        </select>
      </div>

      {/* Mostrar las estadísticas */}
      <div>
        {mesSeleccionado && (
          <>
            <table className="table" style={{ width: "80%", margin: "0 auto", textAlign: "center" }}>
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>Plan</th>
                  <th style={{ width: "15%" }}>Precio</th>
                  <th style={{ width: "15%" }}>Efectivo</th>
                  <th style={{ width: "15%" }}>Transferencia</th>
                  <th style={{ width: "15%" }}>Ganancia Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Plan 1</td>
                  <td>{estadisticas.plan1?.precio || 0}</td>
                  <td>{estadisticas.plan1?.Efectivo || 0}</td>
                  <td>{estadisticas.plan1?.Transferencia || 0}</td>
                  <td>{estadisticas.plan1?.ganancia || 0}</td>
                </tr>
                <tr>
                  <td>Plan 2</td>
                  <td>{estadisticas.plan2?.precio || 0}</td>
                  <td>{estadisticas.plan2?.Efectivo || 0}</td>
                  <td>{estadisticas.plan2?.Transferencia || 0}</td>
                  <td>{estadisticas.plan2?.ganancia || 0}</td>
                </tr>
                {/* Fila con el total */}
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>Total</td>
                  <td>{totalGanancias || 0}</td>
                </tr>
              </tbody>
            </table>

            {/* Sección del gráfico de planes */}
            <div style={{ display: "block", width: "60%", margin: "20px auto" }}>
              <h3 style={{ marginBottom: "10px" }}>Distribución de Personas por Plan</h3>
              <Bar 
                data={dataPlanes} 
                options={{ responsive: true }} 
                height={200} 
                width={300} 
              />
            </div>

            {/* Sección del gráfico de métodos de pago */}
            <div style={{ display: "block", width: "60%", margin: "20px auto" }}>
              <h3 style={{ marginBottom: "10px" }}>Distribución de Métodos de Pago</h3>
              <Bar 
                data={dataMetodosPago} 
                options={{ responsive: true }} 
                height={200} 
                width={300} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportesPago;
