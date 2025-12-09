'use client';

import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider, Content, Header } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const items = [
    { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },
    {
      label: <Link href="/dashboard/resources">Resources</Link>,
      key: '/dashboard/resources',
    },
    {
      label: <Link href="/dashboard/bookings">Bookings</Link>,
      key: '/dashboard/bookings',
    },
    {
      label: <Link href="/dashboard/users">Users</Link>,
      key: '/dashboard/users',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={items}
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
