'use client';
import React, { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  basePrice: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState('');

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, basePrice: Number(basePrice) })
      });
      if (res.ok) {
        setName('');
        setBasePrice('');
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Manage Services</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Service</h2>
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Premium Health Check"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (₹)</label>
            <input 
              required
              type="number" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
              value={basePrice}
              onChange={e => setBasePrice(e.target.value)}
              placeholder="500"
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Add Service
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Service Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Base Price</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900 font-medium">{s.name}</td>
                <td className="px-6 py-4 text-slate-600">₹{s.basePrice}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No services found. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
