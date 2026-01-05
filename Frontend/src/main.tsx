import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TaskContextProvider from "./context/TaskContext.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskContextProvider>
      <App />
    </TaskContextProvider>
  </StrictMode>
);
