import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import UserContextProvider from "./context/UserContext.tsx";
import TaskContextProvider from "./context/TaskContext.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <TaskContextProvider>
        <App />
      </TaskContextProvider>
    </UserContextProvider>
  </StrictMode>
);
