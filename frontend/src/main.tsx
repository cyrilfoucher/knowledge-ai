import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.js";
import { AuthProvider } from "./contexts/AuthContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("L'élément #root est introuvable.");
}

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
