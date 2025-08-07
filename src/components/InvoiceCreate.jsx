import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const InvoiceCreate = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    client_id: '',
    invoice_date: '',
    due_date: '',
    items: [{ description: '', quantity: '', unit_price: '' }],
  });

  const navigate = useNavigate();

  useEffect(() => {
    API.get('/clients')
      .then((res) => setClients(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: '', quantity: 1, unit_price: 0 }],
    });
  };

  const removeItem = (index) => {
    const items = [...form.items];
    items.splice(index, 1);
    setForm({ ...form, items });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = field === 'quantity' || field === 'unit_price' ? Number(value) : value;
    setForm({ ...form, items });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/invoices', form);
      alert('Invoice created!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error creating invoice');
    }
  };

  const subtotal = form.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Create Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-gray-700">Client</label>
          <select
            name="client_id"
            value={form.client_id}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div>
            <label className="block mb-1 text-gray-700">Invoice Number</label>
            <input
              name="invoice_number"
              value={form.invoice_number}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div> */}
          <div>
            <label className="block mb-1 text-gray-700">Invoice Date</label>
            <input
              type="date"
              name="invoice_date"
              value={form.invoice_date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Items</h4>
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
              <input
                className="border px-2 py-1 rounded"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                required
              />
              <input
                type="number"
                min="1"
                className="border px-2 py-1 rounded"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                required
              />
              <input
                type="number"
                min="0"
                className="border px-2 py-1 rounded"
                placeholder="Unit Price"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                required
              />
              {form.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:underline"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 text-blue-600 hover:underline"
          >
            ➕ Add Item
          </button>
        </div>

        <div className="text-right mt-4">
          <p className="text-gray-700">Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p className="text-gray-700">Tax (18% GST): ₹{tax.toFixed(2)}</p>
          <p className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          💾 Save Invoice
        </button>
      </form>
    </div>
  );
};

export default InvoiceCreate;
