'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/services/api';

// -------------------------------
// Add Resource Type (Fix for `unknown` data)
// -------------------------------
type Resource = {
  name: string;
  type: string;
  location?: string;
  description?: string;
  status: string;
  maxDuration?: number;
  requiresApproval: boolean;
};

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();

  // FIX: Correctly read the ID (App Router sometimes returns an array)
  const resourceId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: '',
    location: '',
    description: '',
    status: 'AVAILABLE',
    maxDuration: '',
    requiresApproval: false,
  });

  // -------------------------------
  // Fetch resource details
  // -------------------------------
  useEffect(() => {
    if (!resourceId) return;

    const fetchData = async () => {
      try {
        // Typed Axios response so res.data is NOT unknown
        const res = await api.get<Resource>(`/resources/${resourceId}`);
        const data = res.data;

        setForm({
          name: data.name,
          type: data.type,
          location: data.location || '',
          description: data.description || '',
          status: data.status,
          maxDuration: data.maxDuration?.toString() || '',
          requiresApproval: data.requiresApproval,
        });
      } catch (err) {
        alert('Failed to load resource.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resourceId]);

  // -------------------------------
  // Handle input change
  // -------------------------------
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

    // Normal input / textarea / select
    setForm({
      ...form,
      [name]: value,
    });
  };

  // -------------------------------
  // Submit update
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        maxDuration: form.maxDuration ? Number(form.maxDuration) : null,
      };

      await api.patch(`/resources/${resourceId}`, payload);

      alert('Resource updated successfully!');
      router.push('/dashboard/admin/resources');
    } catch (err) {
      alert('Failed to update resource.');
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------
  // Loading State
  // -------------------------------
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">
        Edit Resource (ID: {resourceId})
      </h1>

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

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Updating...' : 'Update Resource'}
        </button>
      </form>
    </div>
  );
}
