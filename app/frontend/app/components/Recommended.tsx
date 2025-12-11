'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import api from '@/app/services/api';

interface Resource {
  id: number;
  name: string;
  status: string; // AVAILABLE or MAINTENANCE or UNAVAILABLE
}

export default function Recommended() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get<Resource[]>('/resources');

        // Show ONLY top 3
        setResources(res.data.slice(0, 3));
      } catch (err) {
        console.log('Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <Card
      title="Top Resources"
      style={{
        marginBottom: 24,
        borderRadius: 12,
      }}
      loading={loading}
    >
      <Row gutter={[24, 24]}>
        {resources.map((item) => (
          <Col span={8} key={item.id}>
            <Card
              style={{
                borderRadius: 16,
                textAlign: 'center',
                padding: '24px 16px',
                transition: 'transform 0.2s ease',
                height: '210px',
              }}
              styles={{
                body: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '100%',
                },
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              <div>
                <h3 style={{ marginBottom: 8 }}>{item.name}</h3>

                <Tag
                  color={
                    item.status === 'AVAILABLE'
                      ? 'green'
                      : item.status === 'MAINTENANCE'
                      ? 'red'
                      : 'orange'
                  }
                  style={{
                    fontSize: 12,
                    padding: '3px 10px',
                    borderRadius: 6,
                  }}
                >
                  {item.status}
                </Tag>
              </div>

              <Button
                type="primary"
                size="middle"
                disabled={item.status !== 'AVAILABLE'}
                style={{
                  borderRadius: 8,
                  width: '110px',
                }}
                onClick={() => router.push(`/dashboard/resources/${item.id}`)}
              >
                Book Now
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
