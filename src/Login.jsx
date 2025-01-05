import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPersonas } from "./services/api"; // Asegúrate de tener esta función implementada
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de administrador
    if (username === "admin" && password === "admin") {
      console.log("Acceso como administrador");
      navigate("/admin"); // Redirige al panel de administrador
      return;
    }

    // Validación de usuario común
    try {
      const personas = await getPersonas();
      const userExists = personas.some(
        (persona) => persona.id === username && persona.id === password
      );

      if (userExists) {
        console.log("Acceso como usuario");
        navigate("/user"); // Redirige al panel de usuario
      } else {
        alert("Credenciales incorrectas. Verifica tu usuario y contraseña.");
      }
    } catch (error) {
      console.error("Error al validar el usuario:", error);
      alert("Hubo un problema al autenticar. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
