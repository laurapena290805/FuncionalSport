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
  const [newPrecio, setNewPrecio] = useState("");
  const [selectedProducto, setSelectedProducto] = useState("");
  const [tipoPago, setTipoPago] = useState("pTransferencia");
  const [cantidad, setCantidad] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(""); // Estado para el mes seleccionado
  const [isEditing, setIsEditing] = useState(false); // Controla si estamos en modo de edición

  useEffect(() => {
    const fetchVentas = async () => {
      const data = await getVentas();
      setVentas(data);
    };
    fetchVentas();
  }, []);

  // Filtrar ventas por mes
  const filteredVentas = selectedMonth
    ? ventas.filter((venta) => venta.mesAnio === selectedMonth)
    : ventas;

  const handleAddProducto = async () => {
    if (!newProducto || !newPrecio) return alert("El nombre y el precio del producto son requeridos");

    const fechaActual = new Date();
    const mesAnio = `${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}`;

    const nuevoProducto = {
      id: newProducto, // Usamos el nombre del producto como ID
      precio: newPrecio,
      vendidas: 0,
      pTransferencia: 0,
      pEfectivo: 0,
      mesAnio, // Se asigna el mes y año actual
    };

    // Verificar si el producto ya existe en el mes
    const productoExistente = ventas.find(
      (venta) => venta.id === newProducto.id && venta.mesAnio === mesAnio
    );
    if (productoExistente) {
      return alert("Este producto ya existe en el mes seleccionado");
    }

    await createVentas(nuevoProducto);
    setVentas([...ventas, nuevoProducto]);
    setNewProducto("");
    setNewPrecio("");
  };

  const handleAddCompra = async () => {
    if (!selectedProducto || !tipoPago || cantidad <= 0) {
      return alert("Debe seleccionar un producto, un método de pago y una cantidad válida");
    }

    const producto = ventas.find((venta) => venta.id === selectedProducto);
    if (!producto) return alert("Producto no encontrado");

    const fechaActual = new Date();
    const mesAnio = `${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}`;

    // Solo actualizar las cantidades para el mes actual
    const updatedProducto = {
      vendidas: producto.vendidas + cantidad,
      [tipoPago]: producto[tipoPago] + cantidad,
      mesAnio, // Se asigna el mes y año actual
    };

    await updateVentas(selectedProducto, updatedProducto);

    setVentas(
      ventas.map((venta) =>
        venta.id === selectedProducto && venta.mesAnio === mesAnio
          ? { ...venta, ...updatedProducto }
          : venta
      )
    );
  };

  const handleEditProducto = (id) => {
    const producto = ventas.find((venta) => venta.id === id);
    if (!producto) return;
    setNewProducto(producto.id);
    setNewPrecio(producto.precio);
    setIsEditing(true); // Activar modo de edición
  };

  const handleUpdateProducto = async () => {
    if (!newProducto || !newPrecio) return alert("El nombre y el precio del producto son requeridos");

    const updatedProducto = {
      id: newProducto,
      precio: newPrecio,
    };

    await updateVentas(newProducto, updatedProducto);
    setVentas(
      ventas.map((venta) =>
        venta.id === newProducto ? { ...venta, ...updatedProducto } : venta
      )
    );
    setNewProducto("");
    setNewPrecio("");
    setIsEditing(false); // Desactivar modo de edición
  };

  const handleDeleteProducto = async (id) => {
    await deleteVenta(id);
    setVentas(ventas.filter((venta) => venta.id !== id));
  };

  const handleResetProducto = () => {
    setNewProducto("");
    setNewPrecio("");
    setIsEditing(false); // Desactivar modo de edición sin guardar cambios
  };

  return (
    <div className="ventas-page">
      <h1>Gestión de Ventas</h1>

      {/* Filtro de mes */}
      <section className="filter-section">
        <label>Filtrar por mes:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Todos los meses</option>
          <option value="1-2025">Enero 2025</option>
          <option value="2-2025">Febrero 2025</option>
          <option value="3-2025">Marzo 2025</option>
          {/* Puedes agregar más meses de acuerdo a tus necesidades */}
        </select>
      </section>

      {/* Tabla */}
      <section>
        <h2>Listado de Ventas</h2>
        <table className="ventas-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
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
                <td>{venta.precio}</td>
                <td>{venta.vendidas}</td>
                <td>{venta.pTransferencia}</td>
                <td>{venta.pEfectivo}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditProducto(venta.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteProducto(venta.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Formulario Añadir Compra */}
      <section className="form-section">
        <h2>Añadir Venta</h2>
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
          <button onClick={handleAddCompra}>Añadir Venta</button>
        </div>
      </section>

      {/* Formulario Añadir/Editar Producto */}
      <section className="form-section">
        <h2>{isEditing ? "Editar Producto" : "Añadir Producto"}</h2>
        <div className="form-elements">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProducto}
            onChange={(e) => setNewProducto(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Precio"
            value={newPrecio}
            onChange={(e) => setNewPrecio(e.target.value)}
          />
          {isEditing ? (
            <>
              <button onClick={handleUpdateProducto}>Actualizar Producto</button>
              <button onClick={handleResetProducto}>Restaurar</button>
            </>
          ) : (
            <button onClick={handleAddProducto}>Guardar Producto</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ventas;
