import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import InvoiceCreate from "./components/InvoiceCreate";
import InvoiceShow from "./components/InvoiceShow";
import ClientList from "./components/ClientList";
import ClientForm from "./components/ClientForm";
import Register from "./components/Register";
import CompanySettingsForm from "./components/CompanySettingsForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
     !!localStorage.getItem("token")
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        {/* Redirect root to /dashboard if logged in, else to /login */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />

        {/* Protected Routes */}
        {isLoggedIn && (
          <Route path="/" element={<Layout onLogout={() => setIsLoggedIn(false)} />}>
            <Route path="dashboard" element={<Dashboard onLogout={() => setIsLoggedIn(false)} />} />
            <Route path="invoices/create" element={<InvoiceCreate />} />
            <Route path="invoices/:id" element={<InvoiceShow />} />
            <Route path="clients" element={<ClientList />} />
            <Route path="clients/create" element={<ClientForm />} />
            <Route path="clients/edit/:id" element={<ClientForm />} />
            <Route path="/company-settings" element={<CompanySettingsForm />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>

  );
}

export default App;
