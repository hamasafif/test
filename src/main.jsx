// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { TransactionProvider } from "./context/TransactionContext"; // ✅ Tambah ini

// Middleware: hanya user dengan token yang bisa akses App
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// Redirect otomatis kalau user sudah login
function AuthRedirect({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TransactionProvider>
          <Routes>
            {/* Dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />

            {/* Login */}
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              }
            />

            {/* Register */}
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <Register />
                </AuthRedirect>
              }
            />

            {/* Redirect semua route tak dikenal ke /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </TransactionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
