'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import api from '@/app/services/api';

interface Resource {
  id: number;
  name: string;
  status: string;
}

export default function Recommended() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get<Resource[]>('/resources');
        setResources(res.data.slice(0, 3));
      } catch (err) {
        console.log('Failed to fetch resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const tagBg = (s: string) =>
    s === 'AVAILABLE' ? '#f0fff4' : s === 'MAINTENANCE' ? '#fff1f0' : '#fffbe6';
  const tagColor = (s: string) =>
    s === 'AVAILABLE' ? '#52c41a' : s === 'MAINTENANCE' ? '#f5222d' : '#fa8c16';

  return (
    <>
      <Card
        title="Top Resources"
        style={{ marginBottom: 24, borderRadius: 12 }}
        loading={loading}
        bodyStyle={{ padding: 16 }}
      >
        <Row gutter={[24, 24]}>
          {resources.map((item) => (
            <Col
              key={item.id}
              xs={24}
              sm={12}
              md={8}
              style={{ display: 'flex' }}
            >
              <Card
                className="resource-card"
                bodyStyle={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
                style={{ borderRadius: 12, width: '100%' }}
              >
                <div className="resource-top">
                  <h3 className="resource-title">{item.name}</h3>

                  <Tag
                    style={{
                      background: tagBg(item.status),
                      color: tagColor(item.status),
                      fontWeight: 700,
                      borderRadius: 6,
                      padding: '4px 10px',
                      marginTop: 8,
                      display: 'inline-block',
                    }}
                  >
                    {item.status}
                  </Tag>
                </div>

                <div className="resource-cta">
                  <Button
                    type="primary"
                    size="middle"
                    disabled={item.status !== 'AVAILABLE'}
                    className="resource-btn"
                    onClick={() =>
                      router.push(`/dashboard/resources/${item.id}`)
                    }
                  >
                    Book Now
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <style jsx global>{`
        .resource-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .resource-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .resource-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .resource-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
        }

        /* 🔥 DESKTOP CARD HEIGHT FIX */
        @media (min-width: 992px) {
          .resource-card {
            display: flex;
            flex-direction: column;
            justify-content: center; /* 👈 center content vertically */
            align-items: center;
            text-align: center;
          }
        }

        .resource-cta {
          margin-top: auto; /* keep button at bottom */
          padding-top: 16px;
          display: flex;
          justify-content: center;
          width: 100%;
        }
        /* Desktop / tablet fixed button width */
        .resource-btn {
          width: 140px;
          border-radius: 8px;
        }

        /* Mobile responsive behavior */
        @media (max-width: 768px) {
          .resource-card {
            height: auto !important;
          }

          .resource-cta {
            padding: 12px 6px 0 6px;
          }

          .resource-btn {
            width: calc(100% - 24px) !important;
            max-width: none !important;
          }

          .resource-title {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
}
