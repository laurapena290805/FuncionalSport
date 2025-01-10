import React, { useState, useEffect } from 'react';
import { obtenerConteoUsuarios } from './services/api'; // El archivo con la función para obtener los datos 
import { Bar } from 'react-chartjs-2';  // Importamos Chart.js para gráficos de barras
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registramos los componentes de Chart.js necesarios para gráficos de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportePago = () => {
  const [conteo, setConteo] = useState({
    transferencia: 0,
    efectivo: 0,
    plan1: 0,
    plan2: 0,
    ingresos: 0,
  });

  const [precioPlan1, setPrecioPlan1] = useState(50); // Precio del Plan 1
  const [precioPlan2, setPrecioPlan2] = useState(80); // Precio del Plan 2
  const [editandoPrecios, setEditandoPrecios] = useState(false); // Estado para editar los precios

  useEffect(() => {
    const fetchData = async () => {
      const conteoData = await obtenerConteoUsuarios(); // Cambia esta función por la lógica de tu API
      setConteo(conteoData);
    };
    
    fetchData();
  }, []);

  // Calcular el balance (total de ingresos por planes)
  const totalIngresosPlan1 = conteo.plan1 * precioPlan1;
  const totalIngresosPlan2 = conteo.plan2 * precioPlan2;
  const totalIngresos = totalIngresosPlan1 + totalIngresosPlan2;

  // Datos para los gráficos de barras
  const dataPago = {
    labels: ['Transferencia', 'Efectivo'], // Etiquetas para el eje X
    datasets: [
      {
        label: 'Métodos de Pago',
        data: [conteo.transferencia, conteo.efectivo], // Datos de los métodos de pago
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const dataPlanes = {
    labels: ['Plan 1', 'Plan 2'], // Etiquetas para el eje X
    datasets: [
      {
        label: 'Planes',
        data: [conteo.plan1, conteo.plan2], // Datos de los planes
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Manejar el cambio de precios cuando el usuario edite
  const handlePrecioChange = (e, plan) => {
    const newPrecio = parseFloat(e.target.value);
    if (plan === 'plan1') {
      setPrecioPlan1(newPrecio);
    } else if (plan === 'plan2') {
      setPrecioPlan2(newPrecio);
    }
  };

  // Función para confirmar los cambios y deshabilitar la edición
  const handleAceptarCambios = () => {
    setEditandoPrecios(false);
    // Aquí podrías agregar un API call o lógica para guardar los cambios en la base de datos si es necesario
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Reporte de Pago y Planes</h2>

      {/* Sección de Planes */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Planes</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <Bar data={dataPlanes} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Resumen de los datos de los planes */}
        <div style={{ marginTop: '10px' }}>
          <h4>Resumen de Planes</h4>
          <ul>
            <li><strong>Plan 1:</strong> {conteo.plan1} usuarios</li>
            <li><strong>Plan 2:</strong> {conteo.plan2} usuarios</li>
          </ul>
        </div>
      </div>

      {/* Sección de Métodos de Pago */}
      <div>
        <h3>Métodos de Pago</h3>
        <Bar data={dataPago} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        
        {/* Resumen de los métodos de pago */}
        <div style={{ marginTop: '10px' }}>
          <h4>Resumen de Métodos de Pago</h4>
          <ul>
            <li><strong>Transferencia:</strong> {conteo.transferencia} usuarios</li>
            <li><strong>Efectivo:</strong> {conteo.efectivo} usuarios</li>
          </ul>
        </div>
      </div>

      {/* Sección de Balance */}
      <div style={{ marginTop: '40px' }}>
        <h3>Balance</h3>
        <ul>
          <li><strong>Ingresos por Plan 1:</strong> ${totalIngresosPlan1}</li>
          <li><strong>Ingresos por Plan 2:</strong> ${totalIngresosPlan2}</li>
          <li><strong>Total de Ingresos:</strong> ${totalIngresos}</li>
        </ul>
      </div>

      {/* Sección para editar los valores de los planes, ahora debajo del balance */}
      <div style={{ marginTop: '40px' }}>
        <h4>Valores de los Planes</h4>
        {/* Botón para activar/desactivar edición */}
        <button
          style={{ padding: '5px 15px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '10px' }}
          onClick={() => setEditandoPrecios(!editandoPrecios)}
        >
          {editandoPrecios ? 'Cancelar Edición' : 'Editar Precios'}
        </button>

        {/* Input de precio solo visible si está en modo de edición */}
        {editandoPrecios ? (
          <>
            <input
              type="number"
              value={precioPlan1}
              onChange={(e) => handlePrecioChange(e, 'plan1')}
              style={{ margin: '5px 0', padding: '5px', borderRadius: '5px' }}
            />
            <input
              type="number"
              value={precioPlan2}
              onChange={(e) => handlePrecioChange(e, 'plan2')}
              style={{ margin: '5px 0', padding: '5px', borderRadius: '5px' }}
            />
            <button
              style={{ padding: '5px 15px', cursor: 'pointer', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}
              onClick={handleAceptarCambios}
            >
              Aceptar Cambios
            </button>
          </>
        ) : (
          <>
            <p><strong>Plan 1:</strong> ${precioPlan1}</p>
            <p><strong>Plan 2:</strong> ${precioPlan2}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportePago;
