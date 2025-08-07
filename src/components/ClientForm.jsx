import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    email: '',
    gstin: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      API.get(`/clients/${id}`)
        .then(res => setForm(res.data))
        .catch(() => alert('Client not found'));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = isEdit
      ? API.put(`/clients/${id}`, form)
      : API.post('/clients', form);

    req
      .then(() => {
        alert(`Client ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/clients');
      })
      .catch((err) => {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          alert("Something went wrong!");
        }
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Client' : 'Add Client'}</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-6 py-6 space-y-4 border"
      >
        <div>
          <label className="block font-medium mb-1">Client Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Client Name"
            required
          />
             {errors.name && <p className="text-red-600 text-sm">{errors.name[0]}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">GSTIN</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="gstin"
            value={form.gstin}
            onChange={handleChange}
            placeholder="GSTIN (optional)"
          />
              {errors.gstin && <p className="text-red-600 text-sm">{errors.gstin[0]}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Address</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full Address"
            rows={3}
          />
           {errors.address && <p className="text-red-600 text-sm">{errors.address[0]}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          💾 Save Client
        </button>
      </form>
    </div>
  );
};

export default ClientForm;
