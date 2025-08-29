import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import GodMode from "./dev/GodMode.jsx"; // ⬅️ eklendi
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <GodMode />   {/* ⬅️ yalnızca geliştirirken açık; prod’da da zararsız */}
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
