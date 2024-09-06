import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./config/i18n.js";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap the App component with I18nextProvider */}
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
