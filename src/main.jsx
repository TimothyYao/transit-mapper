import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import "./styles/reset.css";
import "./styles/app.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
);
