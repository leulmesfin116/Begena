import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext.jsx";
import { AudioProvider } from "./context/AudioContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
