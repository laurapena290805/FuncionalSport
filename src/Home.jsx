import React from 'react';
import './Home.css'; // Archivo CSS para estilos
import { useNavigate } from 'react-router-dom';
import Image1 from './Imagen1.jpg';
import Image2 from './Image2.jpg';
import Image3 from './Imagen3.jpg';

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">Funcional Sport</h1>
        <button className="login-button" onClick={handleLoginClick}>
          Iniciar Sesión
        </button>
      </header>

      {/* Main content */}
      <main className="main-content">
        <section className="intro-section">
          <h2 className="intro-title">Entrenamiento que transforma</h2>
          <p className="intro-text">
            Logra tus objetivos físicos con nuestros programas adaptados. Desde mejorar tu marca en carreras hasta perder peso o ganar masa muscular.
          </p>
        </section>

        {/* Secciones principales */}
        <section className="feature-section">
          <div className="feature">
            <img src={Image1} alt="Running" className="feature-image" />
            <div className="feature-text">
              <h3>Running Performance</h3>
              <p>
                Mejora tu técnica, resistencia y velocidad con entrenamientos diseñados para corredores de todos los niveles.
              </p>
            </div>
          </div>

          <div className="feature">
            <img src={Image2} alt="Pérdida de Peso" className="feature-image" />
            <div className="feature-text">
              <h3>Pérdida de Peso</h3>
              <p>
                Un enfoque integral que combina entrenamiento funcional y nutrición para ayudarte a alcanzar un peso saludable.
              </p>
            </div>
          </div>

          <div className="feature">
            <img src={Image3} alt="Masa Muscular" className="feature-image" />
            <div className="feature-text">
              <h3>Aumento de Masa Muscular</h3>
              <p>
                Entrenamientos efectivos que maximizan el desarrollo muscular y aumentan tu fuerza de manera progresiva.
              </p>
            </div>
          </div>
        </section>

        {/* Nuevas secciones: Zona de Pesas, Zona Cardio, Sauna */}
        <section className="new-feature-section">
          <div className="new-feature">
            <img src={Image1} alt="Zona de Pesas" className="feature-image" />
            <div className="feature-text">
              <h3>Zona de Pesas</h3>
              <p>
                La zona de pesas está equipada con lo último en maquinaria para fuerza, ideal para aumentar tu masa muscular, mejorar tu fuerza general y tonificar el cuerpo. ¡Aumenta tus marcas con entrenamientos personalizados!
              </p>
            </div>
          </div>
        </section>

        <section className="new-feature-section">
          <div className="new-feature">
            <img src={Image2} alt="Zona Cardio" className="feature-image" />
            <div className="feature-text">
              <h3>Zona Cardio</h3>
              <p>
                Con equipos de última tecnología, la zona de cardio te ayuda a mejorar tu resistencia cardiovascular, quemar calorías y aumentar tu energía. ¡Es perfecta para sesiones de running, ciclismo o entrenamiento en intervalos!
              </p>
            </div>
          </div>
        </section>

        <section className="new-feature-section">
          <div className="new-feature">
            <img src={Image3} alt="Sauna" className="feature-image" />
            <div className="feature-text">
              <h3>Sauna</h3>
              <p>
                El sauna es ideal para la recuperación muscular y la relajación. Ayuda a reducir el estrés, mejorar la circulación y aliviar dolores musculares. ¡La opción perfecta después de un entrenamiento intenso!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Funcional Sport. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
