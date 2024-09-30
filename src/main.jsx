import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import RootLayout from "./layouts/rootLayout";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <RootLayout />
    </HelmetProvider>
  </StrictMode>
);
