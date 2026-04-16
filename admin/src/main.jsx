// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark, // ✅ FORCE DARK THEME
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#020617",
          colorInputBackground: "#020617",
          colorInputText: "#ffffff",
        },
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);