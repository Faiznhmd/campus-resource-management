// 'use client';

// import { Layout, Menu } from 'antd';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// const { Sider, Content, Header } = Layout;

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();

//   const items = [
//     { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },
//     {
//       label: <Link href="/dashboard/resources">Resources</Link>,
//       key: '/dashboard/resources',
//     },
//     {
//       label: <Link href="/dashboard/bookings">Bookings</Link>,
//       key: '/dashboard/bookings',
//     },
//     {
//       label: <Link href="/dashboard/users">Users</Link>,
//       key: '/dashboard/users',
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider theme="dark">
//         <Menu
//           theme="dark"
//           mode="inline"
//           selectedKeys={[pathname]}
//           items={items}
//         />
//       </Sider>

//       <Layout>
//         <Header style={{ background: '#fff', paddingLeft: 20, fontSize: 20 }}>
//           Campus Resource Management
//         </Header>

//         <Content style={{ margin: '20px', background: '#fff', padding: 20 }}>
//           {children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }

'use client';

import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/app/services/api';

const { Sider, Content, Header } = Layout;

interface UserMeResponse {
  id: number;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  // Fetch logged-in user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<UserMeResponse>('/auth/me'); // make sure you have this endpoint
        setRole(res.data.role);
      } catch (err) {
        console.log('Failed to fetch user');
      }
    };

    fetchUser();
  }, []);

  // Menu items for ADMIN
  const adminItems = [
    { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },

    {
      label: 'Resources',
      key: 'resources',
      children: [
        {
          label: <Link href="/dashboard/admin/resources">All Resources</Link>,
          key: '/dashboard/admin/resources',
        },
        {
          label: (
            <Link href="/dashboard/admin/resources/create">
              Create Resource
            </Link>
          ),
          key: '/dashboard/admin/resources/create',
        },
      ],
    },

    {
      label: <Link href="/dashboard/admin/bookings">Bookings</Link>,
      key: '/dashboard/admin/bookings',
    },

    {
      label: <Link href="/dashboard/admin/users">Users</Link>,
      key: '/dashboard/admin/users',
    },
  ];

  // Menu items for NORMAL USER
  const userItems = [
    { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },

    {
      label: <Link href="/dashboard/resources">Browse Resources</Link>,
      key: '/resources',
    },

    {
      label: <Link href="/dashboard/bookings">My Bookings</Link>,
      key: '/dashboard/bookings',
    },

    {
      label: <Link href="/dashboard/profile">Profile</Link>,
      key: '/dashboard/profile',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={role === 'ADMIN' ? adminItems : userItems}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', paddingLeft: 20, fontSize: 20 }}>
          Campus Resource Management
        </Header>

        <Content style={{ margin: '20px', background: '#fff', padding: 20 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
