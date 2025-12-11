'use client';

import { Button, Typography, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Hero() {
  return (
    <>
      <Card className="hero-card">
        <Title level={2} className="hero-title">
          Welcome to Campus Resource Management
        </Title>

        <Paragraph className="hero-text">
          Browse resources, check availability, and manage your bookings easily.
        </Paragraph>

        <Link href="/dashboard/resources" style={{ width: '100%' }}>
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            className="hero-btn"
          >
            Browse Resources
          </Button>
        </Link>
      </Card>

      {/* RESPONSIVE CSS */}
      <style jsx global>{`
        .hero-card {
          margin-bottom: 24px;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
        }

        .hero-title {
          margin-bottom: 10px;
        }

        .hero-text {
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
        }

        .hero-btn {
          border-radius: 8px;
        }

        /* ------------------------------ */
        /* RESPONSIVE STYLES (MOBILE)     */
        /* ------------------------------ */

        @media (max-width: 768px) {
          .hero-card {
            padding: 28px 18px;
          }

          .hero-title {
            font-size: 22px !important;
            text-align: center;
          }

          .hero-text {
            font-size: 14px;
            text-align: center;
          }

          .hero-btn {
            width: 100%;
            height: 48px;
            font-size: 15px;
          }
        }

        /* Tablet */
        @media (max-width: 992px) {
          .hero-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </>
  );
}
