import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      onLogin();
    } catch (err) {
      console.error(err);
      setError("❌ Login failed. Please check your email & password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Welcome Back
        </h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="w-1/4 border-t"></span>
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <span className="w-1/4 border-t"></span>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
