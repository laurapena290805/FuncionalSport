import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCredenciales } from "./services/api"; // Importa el método para obtener credenciales
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Obtén las credenciales de los administradores desde la base de datos
      const admins = await getCredenciales();
      const adminFound = admins.find(
        (admin) => admin.usuario === username && admin.contraseña === password
      );

      // Validación de administrador
      if (adminFound) {
        console.log("Acceso como administrador");
        navigate("/admin"); // Redirige al panel de administrador
        return;
      }

      // Validación de usuario común
      if (username && password) {
        // Aquí podrías validar las credenciales en tu backend si es necesario
        console.log("Acceso como usuario");
        navigate(`/user/${username}`); // Navega pasando el ID del usuario como parte de la URL
      } else {
        alert("Por favor, ingresa usuario y contraseña válidos.");
      }
    } catch (error) {
      console.error("Error al obtener las credenciales de administradores:", error);
      alert("Hubo un problema al iniciar sesión. Intenta nuevamente más tarde.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-btn">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
