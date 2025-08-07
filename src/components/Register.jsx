import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/register", form);
      alert("✅ Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "❌ Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Create an Account</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First + Last Name side-by-side */}
          <div className="flex gap-4">
            <Input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              label="First Name"
              placeholder="John"
              className="w-1/2"
            />
            <Input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              label="Last Name"
              placeholder="Doe"
              className="w-1/2"
            />
          </div>

          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            label="Email"
            placeholder="you@example.com"
          />
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            label="Password"
            placeholder="********"
          />
          <Input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            label="Confirm Password"
            placeholder="********"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

// ⬇️ Reusable Input component with className support
const Input = ({
  type = "text",
  name,
  value,
  onChange,
  label,
  placeholder,
  required = true,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-gray-600 font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
    />
  </div>
);

export default Register;
