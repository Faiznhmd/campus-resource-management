'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Button, Card } from 'antd';
import api from '../../services/api';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';

interface Resource {
  id: string;
  name: string;
  description: string;
  quantity: number;
  status: string;
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get<Resource[]>('/resources');
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const columns: ColumnsType<Resource> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const normalized = status.toLowerCase();

        return (
          <Tag color={normalized === 'available' ? 'green' : 'red'}>
            {normalized.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Resource) => (
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
    <Card title="All Resources" style={{ margin: '20px' }}>
      <Table
        rowKey="id"
        dataSource={resources}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default ResourcesPage;
