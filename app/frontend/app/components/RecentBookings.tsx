'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tag } from 'antd';
import api from '@/app/services/api';

interface Booking {
  id: number;
  resource: { name: string };
  startTime: string;
  endTime: string;
  status: string;
}

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // detect mobile screen
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/me');

        const sorted = res.data
          .sort(
            (a, b) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          )
          .slice(0, 5);

        setBookings(sorted);
      } catch (err) {
        console.log('Failed to load recent bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const columns = [
    { title: 'Resource', dataIndex: ['resource', 'name'], key: 'resource' },
    {
      title: 'Date',
      key: 'date',
      render: (record: Booking) =>
        new Date(record.startTime).toLocaleDateString(),
    },
    {
      title: 'Time',
      key: 'time',
      render: (record: Booking) => {
        const start = new Date(record.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const end = new Date(record.endTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${start} - ${end}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color =
          status === 'APPROVED'
            ? 'green'
            : status === 'PENDING'
            ? 'orange'
            : 'red';
        return (
          <Tag color={color} style={{ fontWeight: 600 }}>
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <Card
      title="Recent Bookings"
      style={{
        marginBottom: 24,
        borderRadius: 12,
        boxShadow: '0 3px 16px rgba(0,0,0,0.07)',
      }}
      loading={loading}
    >
      {/* DESKTOP TABLE */}
      {!isMobile && (
        <Table
          columns={columns}
          dataSource={bookings}
          pagination={false}
          rowKey="id"
        />
      )}

      {/* MOBILE CARD VIEW */}
      {isMobile && (
        <div className="mobile-bookings">
          {bookings.map((b) => (
            <div key={b.id} className="mobile-card">
              <p className="m-title">{b.resource.name}</p>
              <p className="m-text">
                <strong>Date:</strong>{' '}
                {new Date(b.startTime).toLocaleDateString()}
              </p>
              <p className="m-text">
                <strong>Time:</strong>{' '}
                {new Date(b.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {new Date(b.endTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <Tag
                color={
                  b.status === 'APPROVED'
                    ? 'green'
                    : b.status === 'PENDING'
                    ? 'orange'
                    : 'red'
                }
                style={{ marginTop: 8 }}
              >
                {b.status}
              </Tag>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .mobile-bookings {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-card {
          padding: 16px;
          border-radius: 10px;
          background: #fafafa;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .m-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .m-text {
          margin: 2px 0;
          font-size: 14px;
          color: #444;
        }
      `}</style>
    </Card>
  );
}
