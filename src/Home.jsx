import React from 'react';
import './Home.css'; // Asegúrate de importar el archivo CSS
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();  // Hook para navegar entre las páginas

  // Función para manejar el clic en "Iniciar Sesión"
  const handleLoginClick = () => {
    navigate('/login');  // Redirige a la página de login
  };
  return (
    <div className="home-container">
      {/* Encabezado */}
      <header className="header">  {/* Aplica la clase header */}
      <div className="logo">
        <h1>Mi Página Web</h1>
      </div>
      <button className="login-btn" onClick={handleLoginClick}>Iniciar Sesión</button>  {/* Aplica la clase login-btn */}
    </header>

      {/* Encabezado */}
      <header className="home-header">
        <h1>Transforma tu cuerpo y mente</h1>
        <p>Con entrenamientos dinámicos y efectivos en Funcional Sport.</p>
      </header>

      {/* Secciones con imágenes y texto */}
      <section className="section-container">
        {/* Running Performance */}
        <div className="section-content">
          <div className="section-text">
            <h2>Running Performance</h2>
            <p>Mejora tus marcas personales con planes diseñados para optimizar tu rendimiento en carreras.</p>
          </div>
        </div>

        {/* Pérdida de Peso */}
        <div className="section-content reverse">
          <div className="section-text">
            <h2>Pérdida de Peso</h2>
            <p>Logra un cuerpo más saludable y en forma con entrenamientos efectivos y personalizados.</p>
          </div>
        </div>

        {/* Aumento de Masa Muscular */}
        <div className="section-content">
          <div className="section-text">
            <h2>Aumento de Masa Muscular</h2>
            <p>Desarrolla fuerza y músculo con programas adaptados a tus metas específicas.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2025 Funcional Sport. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
