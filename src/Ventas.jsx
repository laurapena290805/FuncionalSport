import React, { useState, useEffect } from "react";
import {
  createVentas,
  updateVentas,
  getVentas,
  deleteVenta,
} from "./services/api";
import "./Ventas.css";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: 0,
    meses: inicializarMeses(),
  });
  const [venta, setVenta] = useState({
    producto: "",
    cantidad: 0,
    metodoPago: "efectivo",
    mes: "enero",
  });
  const [editarProducto, setEditarProducto] = useState(null);  // Estado para el producto que se está editando

  useEffect(() => {
    fetchVentas();
  }, []);

  async function fetchVentas() {
    const data = await getVentas();
    setProductos(data);
  }

  function inicializarMeses() {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const estructuraMeses = {};
    meses.forEach(mes => {
      estructuraMeses[mes] = { efectivo: 0, transferencia: 0 };
    });
    return estructuraMeses;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  const handleVentaChange = (e) => {
    const { name, value } = e.target;
    setVenta({ ...venta, [name]: value });
  };

  const handleEditarChange = (e) => {
    const { name, value } = e.target;
    setEditarProducto({ ...editarProducto, [name]: value });
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.precio || nuevoProducto.precio <= 0 || !nuevoProducto.nombre) {
      alert("Por favor, ingresa un nombre y un precio válido.");
      return;
    }
    const productoCreado = { ...nuevoProducto };
    await createVentas(productoCreado.nombre, productoCreado);
    setProductos([...productos, productoCreado]);
    setNuevoProducto({ precio: 0, meses: inicializarMeses() });
  };

  const agregarVenta = async () => {
    const productoSeleccionado = productos.find(p => p.nombre === venta.producto);
    if (!productoSeleccionado) {
      alert("Producto no encontrado");
      return;
    }
    const updatedMeses = { ...productoSeleccionado.meses };
    updatedMeses[venta.mes][venta.metodoPago] += parseFloat(venta.cantidad);
    
    await updateVentas(venta.producto, { meses: updatedMeses });
    fetchVentas();
    setVenta({ producto: "", cantidad: 0, metodoPago: "efectivo", mes: "enero" });
  };

  const handleEliminar = async (productoNombre) => {
    await deleteVenta(productoNombre);
    fetchVentas();
  };

  const handleRestablecer = async (productoNombre) => {
    const producto = productos.find(p => p.nombre === productoNombre);
    const resetMeses = inicializarMeses();
    await updateVentas(productoNombre, { meses: resetMeses });
    fetchVentas();
  };

  const handleEditar = (producto) => {
    setEditarProducto(producto);
  };

  const handleGuardarEdicion = async () => {
    if (!editarProducto.nombre || editarProducto.precio <= 0) {
      alert("Por favor, ingresa un nombre y precio válido.");
      return;
    }

    await updateVentas(editarProducto.nombre, editarProducto);
    fetchVentas();
    setEditarProducto(null); // Cerrar el formulario de edición
  };

  return (
    <div className="ventas-container">
      <h2>Gestión de Ventas</h2>
      
      {/* Tabla de Productos */}
      <h3>Lista de Productos</h3>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad Efectivo</th>
            <th>Cantidad Transferencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.nombre}>
              <td>{producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>{producto.meses[venta.mes]?.efectivo || 0}</td>
              <td>{producto.meses[venta.mes]?.transferencia || 0}</td>
              <td>
                <button onClick={() => handleEditar(producto)} className="btn btn-warning">Editar</button>
                <button onClick={() => handleRestablecer(producto.nombre)} className="btn btn-warning">Restablecer</button>
                <button onClick={() => handleEliminar(producto.nombre)} className="btn btn-danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Edición de Producto */}
      {editarProducto && (
        <div className="modal-edicion">
          <h3>Editar Producto</h3>
          <div className="input-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del producto"
              value={editarProducto.nombre}
              onChange={handleEditarChange}
              className="input-field"
            />
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={editarProducto.precio}
              onChange={handleEditarChange}
              className="input-field"
            />
          </div>
          <button onClick={handleGuardarEdicion} className="btn btn-success">Guardar Cambios</button>
          <button onClick={() => setEditarProducto(null)} className="btn btn-secondary">Cancelar</button>
        </div>
      )}

      {/* Sección Añadir Producto */}
      <div className="formulario producto-form">
        <h3>Añadir Producto</h3>
        <div className="input-group">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={nuevoProducto.nombre || ""}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <button onClick={agregarProducto} className="btn btn-primary">Añadir Producto</button>
      </div>

      {/* Sección Añadir Venta */}
      <div className="formulario venta-form">
        <h3>Añadir Venta</h3>
        <div className="input-group">
          <select name="mes" value={venta.mes} onChange={handleVentaChange} className="input-field">
            {Object.keys(inicializarMeses()).map((mes) => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
          <select name="producto" value={venta.producto} onChange={handleVentaChange} className="input-field">
            <option value="">Selecciona un producto</option>
            {productos.map((producto) => (
              <option key={producto.nombre} value={producto.nombre}>{producto.nombre}</option>
            ))}
          </select>
          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={venta.cantidad}
            onChange={handleVentaChange}
            className="input-field"
          />
          <select name="metodoPago" value={venta.metodoPago} onChange={handleVentaChange} className="input-field">
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <button onClick={agregarVenta} className="btn btn-success">Registrar Venta</button>
      </div>

    </div>
  );
};

export default Ventas;
