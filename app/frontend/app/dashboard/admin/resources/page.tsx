'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/app/services/api';

type Booking = {
  id: number;
  userId: number;
  resourceId: number;
  startTime: string;
  endTime: string;
  status: string;
};

type Resource = {
  id: number;
  name: string;
  description?: string;
  status: string;
  bookings?: Booking[];
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Resource[]>('/resources/admin');
        setResources(res.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Resources</h2>

      {/* Table Container EXACT match */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">
                Name
              </th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">
                Description
              </th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">
                Bookings
              </th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">
                Status
              </th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold">
                Action
              </th>
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {resources.map((r) => (
              <tr
                key={r.id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                {/* Name */}
                <td className="py-4 px-6 text-gray-900 font-medium">
                  {r.name}
                </td>

                {/* Description */}
                <td className="py-4 px-6 text-gray-700">
                  {r.description || 'No description'}
                </td>

                {/* Bookings */}
                <td className="py-4 px-6 text-gray-700">
                  {r.bookings?.length || 0}
                </td>

                {/* STATUS badge EXACT like user UI */}
                <td className="py-4 px-6">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      r.status === 'BOOKED'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                {/* ACTION buttons EXACT user style */}
                <td className="py-4 px-6">
                  <div className="flex gap-4">
                    {/* View button (same as "View / Book") */}
                    <Link
                      href={`/dashboard/admin/resources/${r.id}`}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      View
                    </Link>

                    {/* Edit button (gray variant) */}
                    <Link
                      href={`/dashboard/admin/resources/${r.id}/edit`}
                      className="bg-gray-800 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-gray-900 transition"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
