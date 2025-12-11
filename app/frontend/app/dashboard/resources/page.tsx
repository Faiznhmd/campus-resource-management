'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Button, Card } from 'antd';
import api from '../../services/api';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';

interface Resource {
  id: number;
  name: string;
  description: string;
  quantity: number;
  status: string;
}

interface BookedSlot {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get<Resource[]>('/resources');

      const updated = await Promise.all(
        res.data.map(async (resource) => {
          const bookings = await api.get<BookedSlot[]>(
            `/bookings/resource/${resource.id}`
          );

          const now = new Date().getTime();

          const active = bookings.data.some((slot) => {
            const start = new Date(slot.startTime).getTime();
            const end = new Date(slot.endTime).getTime();
            return (
              slot.status !== 'COMPLETED' &&
              slot.status !== 'REJECTED' &&
              now >= start &&
              now <= end
            );
          });

          return {
            ...resource,
            status: active ? 'BOOKED' : resource.status,
          };
        })
      );

      setResources(updated);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Desktop table columns
  const columns: ColumnsType<Resource> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },

    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const color =
          record.status === 'AVAILABLE'
            ? 'green'
            : record.status === 'BOOKED'
            ? 'red'
            : 'orange';

        return <Tag color={color}>{record.status}</Tag>;
      },
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => router.push(`/dashboard/resources/${record.id}`)}
        >
          View / Book
        </Button>
      ),
    },
  ];

  return (
    <Card title="All Resources" style={{ margin: 20, borderRadius: 12 }}>
      {/* ------------------ DESKTOP TABLE VIEW ------------------ */}
      {!isMobile && (
        <Table
          rowKey="id"
          dataSource={resources}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* ------------------ MOBILE LIST VIEW ------------------ */}
      {isMobile && (
        <div className="mobile-resource-list">
          {resources.map((r) => (
            <div key={r.id} className="resource-mobile-card">
              <h3 className="m-title">{r.name}</h3>

              <p className="m-text">
                <strong>Description:</strong> {r.description}
              </p>

              <p className="m-text">
                <strong>Quantity:</strong> {r.quantity}
              </p>

              <Tag
                color={
                  r.status === 'AVAILABLE'
                    ? 'green'
                    : r.status === 'BOOKED'
                    ? 'red'
                    : 'orange'
                }
                style={{ marginTop: 10 }}
              >
                {r.status}
              </Tag>

              <Button
                type="primary"
                block
                style={{ marginTop: 12 }}
                onClick={() => router.push(`/dashboard/resources/${r.id}`)}
              >
                View / Book
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* MOBILE STYLE */}
      <style jsx>{`
        .mobile-resource-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 4px;
        }

        .resource-mobile-card {
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
          margin: 3px 0;
          font-size: 14px;
          color: #444;
        }
      `}</style>
    </Card>
  );
};

export default ResourcesPage;
