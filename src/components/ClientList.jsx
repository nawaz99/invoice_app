import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    API.get('/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  };

  const deleteClient = (id) => {
    if (window.confirm('Delete this client?')) {
      API.delete(`/clients/${id}`)
        .then(() => fetchClients())
        .catch(err => alert('Error deleting client'));
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <button
          onClick={() => navigate('/clients/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Client
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm shadow rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">GSTIN</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{client.name}</td>
                <td className="py-2 px-4 border">{client.email}</td>
                <td className="py-2 px-4 border">{client.gstin}</td>
                <td className="py-2 px-4 border">{client.address}</td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => navigate(`/clients/edit/${client.id}`)}
                    className="text-yellow-600 hover:text-yellow-800 mr-3"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;
