// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast"; // ✅ ADD THIS

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#020617",
          colorInputBackground: "#020617",
          colorInputText: "#ffffff",
        },
      }}
    >
      <>
        <App />

        {/* ✅ GLOBAL TOASTER */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000, // ✅ ALL TOASTS 2 SEC
            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid #374151",
            },
          }}
        />
      </>
    </ClerkProvider>
  </React.StrictMode>
);