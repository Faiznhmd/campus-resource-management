'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/app/services/api';
import { Tag, Button } from 'antd';

interface BookingDetails {
  id: number;
  status: string;
  startTime: string;
  endTime: string;

  user: {
    id: number;
    name: string;
    email: string;
  };

  resource: {
    id: number;
    name: string;
    type: string;
    location?: string | null;
  };
}

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await api.get<BookingDetails>(`/bookings/${id}`);
      setBooking(res.data);
    } catch (err) {
      alert('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    try {
      await api.patch(`/bookings/${id}/approve`);
      alert('Booking approved!');
      router.refresh();
    } catch {
      alert('Failed to approve booking');
    }
  };

  const reject = async () => {
    try {
      await api.patch(`/bookings/${id}/reject`);
      alert('Booking rejected!');
      router.refresh();
    } catch {
      alert('Failed to reject booking');
    }
  };

  if (loading) return <p>Loading booking data...</p>;
  if (!booking) return <p>Booking not found.</p>;

  // Status color
  const statusColor =
    booking.status === 'PENDING'
      ? 'gold'
      : booking.status === 'APPROVED'
      ? 'green'
      : booking.status === 'REJECTED'
      ? 'red'
      : 'blue';

  return (
    <div className="p-6">
      <Button onClick={() => router.back()} style={{ marginBottom: 20 }}>
        ← Back
      </Button>

      <h1 className="text-2xl font-bold mb-4">
        Booking Details (ID: {booking.id})
      </h1>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <p>
          <strong>Status: </strong>
          <Tag color={statusColor}>{booking.status}</Tag>
        </p>

        <p>
          <strong>Start Time:</strong>{' '}
          {new Date(booking.startTime).toLocaleString()}
        </p>

        <p>
          <strong>End Time:</strong>{' '}
          {new Date(booking.endTime).toLocaleString()}
        </p>
      </div>

      <h2 className="text-xl font-bold mb-2">User Information</h2>
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p>
          <strong>Name:</strong> {booking.user.name}
        </p>
        <p>
          <strong>Email:</strong> {booking.user.email}
        </p>
        <p>
          <strong>User ID:</strong> {booking.user.id}
        </p>
      </div>

      <h2 className="text-xl font-bold mb-2">Resource Information</h2>
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p>
          <strong>Name:</strong> {booking.resource.name}
        </p>
        <p>
          <strong>Type:</strong> {booking.resource.type}
        </p>
        <p>
          <strong>ID:</strong> {booking.resource.id}
        </p>
        <p>
          <strong>Location:</strong> {booking.resource.location || 'N/A'}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      {booking.status === 'PENDING' && (
        <div className="space-x-4">
          <Button type="primary" onClick={approve}>
            Approve
          </Button>
          <Button danger onClick={reject}>
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
