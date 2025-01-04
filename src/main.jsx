import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// Renderizamos la aplicación
ReactDOM.createRoot(document.getElementById("app")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);