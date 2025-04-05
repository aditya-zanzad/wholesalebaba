import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { unregister } from './serviceWorker';

const root = createRoot(document.getElementById("root"));

// Unregister service workers
unregister();

// Render the app
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
