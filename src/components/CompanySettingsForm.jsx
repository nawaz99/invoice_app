import React, { useEffect, useState } from "react";
import API from "../services/api";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

const CompanySettingsForm = () => {
  const [form, setForm] = useState({
    company_name: "",
    phone: "",
    address: "",
    logo: null,
  });

  const [existingLogoUrl, setExistingLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/company-settings/me");
        const data = res.data;

        setForm({
          company_name: data.company_name || "",
          phone: data.phone?.replace(/^\+/, "") || "",
          address: data.address || "",
          logo: null,
        });

        if (data.logo_url) {
          setExistingLogoUrl(data.logo_url);
        }
      } catch (error) {
        console.log("No existing settings found");
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, logo: file });

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setExistingLogoUrl(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("company_name", form.company_name);
    formData.append("phone", `+${form.phone}`);
    formData.append("address", form.address);
    if (form.logo) formData.append("logo", form.logo);

    try {
      const res = await API.post("/company-settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.logo_url) {
        setExistingLogoUrl(res.data.logo_url);
      }

      setMessage("✅ Company settings saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to save company settings.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Company Settings</h2>

      {message && (
        <div className="mb-4 text-center text-sm text-white bg-indigo-500 py-2 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Your Company Pvt Ltd"
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone</label>
          <PhoneInput
            country={'in'}
            value={form.phone}
            onChange={(value) => setForm({ ...form, phone: value })}
            enableSearch
            inputProps={{
              name: 'phone',
              required: true,
            }}
            inputClass="!w-full !border !rounded !py-2 pl-14"
            containerClass="!w-full"
            buttonClass="!border-r"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            placeholder="Company address"
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Company Logo</label>
          {existingLogoUrl && (
            <div className="mb-2">
              <img
                src={existingLogoUrl}
                alt="Current Logo"
                className="h-16 w-auto object-contain border rounded"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-4 py-2 rounded bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold transition duration-300 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default CompanySettingsForm;
