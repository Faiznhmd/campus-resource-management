'use client';

import { useState } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function CreateResourcePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    type: '',
    location: '',
    description: '',
    status: 'AVAILABLE',
    maxDuration: '',
    requiresApproval: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;

    // Checkbox handling
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setForm({
        ...form,
        [name]: target.checked,
      });
      return;
    }

    // Normal inputs
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        maxDuration: form.maxDuration ? Number(form.maxDuration) : null,
      };

      await api.post('/resources', payload);

      alert('Resource created successfully!');
      router.push('/dashboard/admin/resources');
    } catch (err) {
      alert('Resource creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Create New Resource</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <div>
          <label className="font-semibold">Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="font-semibold">Type *</label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="EQUIPMENT / LAB / ROOM"
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className="font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          ></textarea>
        </div>

        {/* STATUS */}
        <div>
          <label className="font-semibold">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BOOKED">BOOKED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>

        {/* MAX DURATION */}
        <div>
          <label className="font-semibold">Max Duration (Hours)</label>
          <input
            type="number"
            name="maxDuration"
            value={form.maxDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>

        {/* REQUIRES APPROVAL */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="requiresApproval"
            checked={form.requiresApproval}
            onChange={handleChange}
          />
          <label className="font-semibold">Requires Approval</label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Creating...' : 'Create Resource'}
        </button>
      </form>
    </div>
  );
}
