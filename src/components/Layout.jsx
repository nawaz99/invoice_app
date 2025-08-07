import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // optional icons for mobile toggle

const Layout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("invoice_token");
    onLogout();
    navigate("/");
  };

  const navLinks = [
    { path: "/dashboard", label: "🏠 Dashboard" },
    { path: "/invoices/create", label: "➕ Create Invoice" },
    { path: "/clients", label: "👥 Clients" },
    { path: "/clients/create", label: "➕ Add Client" },
    { path: "/company-settings", label: "🏢 Company Settings" }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 bg-gray-900 text-white flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Invoice App</h2>
        <nav className="flex flex-col space-y-3 text-base">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:bg-gray-800 px-3 py-2 rounded transition"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="text-red-400 hover:text-red-300 text-left px-3 py-2"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-900 text-white p-2 rounded"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white p-6 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden z-50`}
      >
        <h2 className="text-xl font-bold mb-6">Invoice App</h2>
        <nav className="flex flex-col space-y-3 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:bg-gray-800 px-3 py-2 rounded transition"
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="text-red-300 hover:underline text-left mt-4"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Page Content */}
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
