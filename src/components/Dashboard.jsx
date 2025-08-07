import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import InvoiceList from "../components/InvoiceList";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/invoices")
      .then((res) => {
        setInvoices(res.data);

        // ✅ Monthly totals for the chart
        const monthlyTotals = {};
        res.data.forEach((inv) => {
          const month = new Date(inv.invoice_date).toLocaleString("default", {
            month: "short",
          });
          monthlyTotals[month] =
            (monthlyTotals[month] || 0) + parseFloat(inv.total);
        });

        const chart = Object.keys(monthlyTotals).map((month) => ({
          month,
          total: monthlyTotals[month],
        }));

        setChartData(chart);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalEarnings = invoices.reduce(
    (sum, inv) => sum + parseFloat(inv.total),
    0
  );

  const logout = () => {
    localStorage.removeItem("token");
    onLogout(); // triggers redirect in App
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          📊 Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Invoices</p>
          <h2 className="text-4xl font-bold text-indigo-600">
            {invoices.length}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Earnings</p>
          <h2 className="text-4xl font-bold text-green-600">
            ₹ {totalEarnings.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* ✅ Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Monthly Earnings
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">No data available yet</p>
        )}
      </div>

      {/* ✅ Quick Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={() => navigate("/clients")}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow transition duration-300"
        >
          👥 Manage Clients
        </button>
        <button
          onClick={() => navigate("/invoices/create")}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg shadow transition duration-300"
        >
          ➕ Create Invoice
        </button>
      </div>

      {/* ✅ Invoice List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Invoices
        </h3>
        <InvoiceList />
      </div>
    </div>
  );
};

export default Dashboard;
