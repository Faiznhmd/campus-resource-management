'use client';

import { Button, Typography, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Hero() {
  return (
    <Card
      style={{
        marginBottom: 24,
        padding: '40px 30px',
        borderRadius: 12,
        boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
      }}
    >
      <Title level={2} style={{ marginBottom: 10 }}>
        Welcome to Campus Resource Management
      </Title>

      <Paragraph style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>
        Browse resources, check availability, and manage your bookings easily.
      </Paragraph>

      <Link href="/dashboard/resources">
        <Button
          type="primary"
          size="large"
          icon={<SearchOutlined />}
          style={{ borderRadius: 8 }}
        >
          Browse Resources
        </Button>
      </Link>
    </Card>
  );
}
