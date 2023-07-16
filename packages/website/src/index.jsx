import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./components/App.jsx";

const example = `digraph { a -> b }`;

const root = createRoot(document.getElementById("app"));
root.render(
  <StrictMode>
    <App initialSrc={example} />
  </StrictMode>
);
