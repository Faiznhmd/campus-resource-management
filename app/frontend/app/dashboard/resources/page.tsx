// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { Table, Tag, Button, Card } from 'antd';
// // import api from '../../services/api';
// // import { useRouter } from 'next/navigation';
// // import type { ColumnsType } from 'antd/es/table';

// // interface Resource {
// //   id: string;
// //   name: string;
// //   description: string;
// //   quantity: number;
// //   status: string; // computed by backend
// // }

// // const ResourcesPage = () => {
// //   const [resources, setResources] = useState<Resource[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const router = useRouter();

// //   const fetchResources = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await api.get<Resource[]>('/resources');
// //       setResources(res.data);
// //     } catch (err) {
// //       console.error('Error fetching resources:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchResources();
// //   }, []);

// //   const columns: ColumnsType<Resource> = [
// //     {
// //       title: 'Name',
// //       dataIndex: 'name',
// //       key: 'name',
// //     },
// //     {
// //       title: 'Description',
// //       dataIndex: 'description',
// //       key: 'description',
// //     },
// //     {
// //       title: 'Quantity',
// //       dataIndex: 'quantity',
// //       key: 'quantity',
// //     },
// //     {
// //       title: 'Status',
// //       dataIndex: 'status',
// //       key: 'status',
// //       render: (status: string) => (
// //         <Tag color={status.toLowerCase() === 'available' ? 'green' : 'red'}>
// //           {status.toUpperCase()}
// //         </Tag>
// //       ),
// //     },
// //     {
// //       title: 'Action',
// //       key: 'action',
// //       render: (_, record) => (
// //         <Button
// //           type="primary"
// //           onClick={() => router.push(`/dashboard/resources/${record.id}`)}
// //         >
// //           View / Book
// //         </Button>
// //       ),
// //     },
// //   ];

// //   return (
// //     <Card title="All Resources" style={{ margin: '20px' }}>
// //       <Table
// //         rowKey="id"
// //         dataSource={resources}
// //         columns={columns}
// //         loading={loading}
// //         pagination={{ pageSize: 5 }}
// //       />
// //     </Card>
// //   );
// // };

// // export default ResourcesPage;

// 'use client';

// import { useEffect, useState } from 'react';
// import { Table, Tag, Button, Card } from 'antd';
// import api from '@/app/services/api';
// import { useRouter } from 'next/navigation';
// import type { ColumnsType } from 'antd/es/table';

// interface Resource {
//   id: number;
//   name: string;
//   description: string;
//   quantity: number;
//   status: string;
// }

// export default function ResourcesPage() {
//   const [resources, setResources] = useState<Resource[]>([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const fetchResources = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get<Resource[]>('/resources');
//       setResources(res.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchResources();
//   }, []);

//   const columns: ColumnsType<Resource> = [
//     { title: 'Name', dataIndex: 'name' },
//     { title: 'Description', dataIndex: 'description' },
//     { title: 'Quantity', dataIndex: 'quantity' },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       render: (status: string) => (
//         <Tag color={status === 'AVAILABLE' ? 'green' : 'red'}>{status}</Tag>
//       ),
//     },
//     {
//       title: 'Action',
//       render: (_, record) => (
//         <Button
//           type="primary"
//           onClick={() => router.push(`/dashboard/resources/${record.id}`)}
//         >
//           View / Book
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Card title="All Resources" style={{ margin: 20 }}>
//       <Table
//         rowKey="id"
//         dataSource={resources}
//         columns={columns}
//         loading={loading}
//         pagination={{ pageSize: 5 }}
//       />
//     </Card>
//   );
// }

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
  status: string; // backend status
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

  const router = useRouter();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);

      const res = await api.get<Resource[]>('/resources');

      // Now for each resource → check active booking
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

          // if booking active → override status to BOOKED
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
    <Card title="All Resources" style={{ margin: 20 }}>
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
