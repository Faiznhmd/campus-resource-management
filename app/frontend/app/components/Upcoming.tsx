'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  resource: {
    name: string;
  };
  startTime: string;
  endTime: string;
  status: string;
}

export default function Upcoming() {
  const [upcoming, setUpcoming] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/me');
        const now = new Date().getTime();

        // Filter future bookings
        const futureBookings = res.data.filter(
          (b) => new Date(b.startTime).getTime() > now
        );

        // Sort by earliest first
        futureBookings.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        // Take the nearest upcoming booking
        setUpcoming(futureBookings[0] || null);
      } catch (err) {
        console.log('Failed to fetch upcoming booking');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <Card
      title="Upcoming Booking"
      loading={loading}
      style={{
        marginBottom: 24,
        borderRadius: 12,
        boxShadow: '0 3px 16px rgba(0,0,0,0.07)',
      }}
    >
      {/* If NO UPCOMING BOOKING */}
      {!upcoming && !loading && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <p>No upcoming booking.</p>
          <Button
            type="primary"
            onClick={() => router.push('/dashboard/resources')}
            style={{ marginTop: 10 }}
          >
            Book a Resource
          </Button>
        </div>
      )}

      {/* If UPCOMING BOOKING EXISTS */}
      {upcoming && (
        <div>
          <p>
            <strong>Resource:</strong> {upcoming.resource.name}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {new Date(upcoming.startTime).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong>{' '}
            {new Date(upcoming.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' - '}
            {new Date(upcoming.endTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>

          <Button
            type="primary"
            style={{ marginTop: 10 }}
            onClick={() => router.push(`/dashboard/bookings/${upcoming.id}`)}
          >
            View Booking
          </Button>
        </div>
      )}
    </Card>
  );
}
