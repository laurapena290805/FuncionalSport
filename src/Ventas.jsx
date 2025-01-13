import React, { useState, useEffect } from "react";
import {
  createVentas,
  updateVentas,
  getVentas,
  deleteVenta,
} from "./services/api";
import "./Ventas.css";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [newProducto, setNewProducto] = useState("");
  const [selectedProducto, setSelectedProducto] = useState("");
  const [tipoPago, setTipoPago] = useState("pTransferencia");
  const [cantidad, setCantidad] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(""); // Estado para el mes seleccionado

  useEffect(() => {
    const fetchVentas = async () => {
      const data = await getVentas();
      setVentas(data);
    };
    fetchVentas();
  }, []);

  const handleAddProducto = async () => {
    if (!newProducto) return alert("El nombre del producto es requerido");
    const fechaActual = new Date();
    const mesAnio = `${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}`;

    const nuevoProducto = {
      vendidas: 0,
      pTransferencia: 0,
      pEfectivo: 0,
      mesAnio, // Añadimos el mes y año
    };
    await createVentas(newProducto, nuevoProducto);
    setVentas([...ventas, { id: newProducto, ...nuevoProducto }]);
    setNewProducto("");
  };

  const handleAddCompra = async () => {
    if (!selectedProducto || !tipoPago || cantidad <= 0) {
      return alert("Debe seleccionar un producto, un método de pago y una cantidad válida");
    }

    const producto = ventas.find((venta) => venta.id === selectedProducto);
    if (!producto) return alert("Producto no encontrado");

    const fechaActual = new Date();
    const mesAnio = `${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}`;

    const updatedProducto = {
      vendidas: producto.vendidas + cantidad,
      [tipoPago]: producto[tipoPago] + cantidad,
      mesAnio, // Añadimos el mes y año
    };

    await updateVentas(selectedProducto, updatedProducto);

    setVentas(
      ventas.map((venta) =>
        venta.id === selectedProducto ? { ...venta, ...updatedProducto } : venta
      )
    );
  };

  const handleDeleteProducto = async (id) => {
    await deleteVenta(id);
    setVentas(ventas.filter((venta) => venta.id !== id));
  };

  const handleResetVentas = async (id) => {
    const resetProducto = {
      vendidas: 0,
      pTransferencia: 0,
      pEfectivo: 0,
      mesAnio: `${new Date().getMonth() + 1}-${new Date().getFullYear()}`, // Reseteamos el mes actual
    };
    await updateVentas(id, resetProducto);
    setVentas(
      ventas.map((venta) =>
        venta.id === id ? { ...venta, ...resetProducto } : venta
      )
    );
  };

  // Filtrar las ventas por mes seleccionado, pero siempre mostrar todos los productos
  const filteredVentas = ventas.map((venta) => {
    if (selectedMonth && venta.mesAnio !== selectedMonth) {
      return { ...venta, pTransferencia: 0, pEfectivo: 0, vendidas: 0 }; // Si no se vendieron productos, asignamos 0
    }
    return venta;
  });

  return (
    <div className="ventas-page">
      <h1>Gestión de Ventas</h1>

      {/* Selección de mes */}
      <section>
        <h2>Filtrar por Mes</h2>
        <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
          <option value="">Selecciona un mes</option>
          {ventas
            .map((venta) => venta.mesAnio)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((mes) => (
              <option key={mes} value={mes}>
                {mes}
              </option>
            ))}
        </select>
      </section>

      {/* Tabla */}
      <section>
        <h2>Listado de Ventas</h2>
        <table className="ventas-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Vendidas</th>
              <th>Transferencia</th>
              <th>Efectivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{venta.vendidas}</td>
                <td>{venta.pTransferencia}</td>
                <td>{venta.pEfectivo}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteProducto(venta.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn-reset"
                    onClick={() => handleResetVentas(venta.id)}
                  >
                    Restablecer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Formulario Añadir Compra */}
      <section className="form-section">
        <h2>Añadir Compra</h2>
        <div className="form-elements">
          <select
            value={selectedProducto}
            onChange={(e) => setSelectedProducto(e.target.value)}
          >
            <option value="">Selecciona un producto</option>
            {ventas.map((venta) => (
              <option key={venta.id} value={venta.id}>
                {venta.id}
              </option>
            ))}
          </select>
          <select
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
          >
            <option value="pTransferencia">Transferencia</option>
            <option value="pEfectivo">Efectivo</option>
          </select>
          <input
            type="number"
            min="1"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
          <button onClick={handleAddCompra}>Añadir Compra</button>
        </div>
      </section>

      {/* Formulario Añadir Producto */}
      <section className="form-section">
        <h2>Añadir Producto</h2>
        <div className="form-elements">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProducto}
            onChange={(e) => setNewProducto(e.target.value)}
          />
          <button onClick={handleAddProducto}>Añadir Producto</button>
        </div>
      </section>
    </div>
  );
};

export default Ventas;
