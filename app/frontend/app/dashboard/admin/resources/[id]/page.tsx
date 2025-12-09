'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/app/services/api';
import Link from 'next/link';

type Booking = {
  id: number;
  userId: number;
  startTime: string;
  endTime: string;
  status: string;
};

type Resource = {
  id: number;
  name: string;
  type: string;
  status: string;
  location?: string;
  maxDuration?: number;
  description?: string;
  requiresApproval: boolean;
  bookings?: Booking[];
};

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await api.get<Resource>(`/resources/${resourceId}`);
      setResource(res.data);
    } catch {
      alert('Failed to load resource.');
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = async () => {
    if (!confirm('Delete this resource?')) return;

    try {
      await api.delete(`/resources/${resourceId}`);
      alert('Resource deleted');
      router.push('/dashboard/admin/resources');
    } catch {
      alert('Failed to delete.');
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!resource) return <p className="p-6">Resource does not exist.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">{resource.name}</h1>

        <div className="flex gap-4">
          <Link
            href={`/dashboard/admin/resources/${resourceId}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit
          </Link>

          <button
            onClick={deleteResource}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl border shadow bg-white space-y-2">
        <p>
          <strong>Type:</strong> {resource.type}
        </p>
        <p>
          <strong>Status:</strong> {resource.status}
        </p>
        <p>
          <strong>Location:</strong> {resource.location || 'N/A'}
        </p>
        <p>
          <strong>Max Duration:</strong> {resource.maxDuration || 'N/A'}
        </p>
        <p>
          <strong>Requires Approval:</strong>{' '}
          {resource.requiresApproval ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Description:</strong>{' '}
          {resource.description || 'No description available'}
        </p>
      </div>

      <h2 className="text-xl font-bold">Bookings</h2>

      {resource.bookings?.length ? (
        <div className="overflow-hidden rounded-xl border shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Start</th>
                <th className="p-3 border">End</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {resource.bookings.map((b) => (
                <tr key={b.id} className="border hover:bg-gray-50">
                  <td className="p-3 border">{b.id}</td>
                  <td className="p-3 border">{b.userId}</td>
                  <td className="p-3 border">{b.startTime}</td>
                  <td className="p-3 border">{b.endTime}</td>
                  <td className="p-3 border">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}
