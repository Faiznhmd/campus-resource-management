'use client';

import { useEffect, useState } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import api from '@/app/services/api';

const { Header, Content } = Layout;

interface UserMeResponse {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<'ADMIN' | 'USER' | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<UserMeResponse>('/auth/me');
        setRole(res.data.role);
      } catch (err) {
        console.log('Failed to fetch user role');
      }
    };
    fetchUser();
  }, []);

  // Admin menu
  const adminMenu = [
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
    { label: <Link href="/auth/logout">Logout</Link>, key: '/auth/logout' },
  ];

  // User menu
  const userMenu = [
    { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },
    {
      label: <Link href="/dashboard/resources">Browse Resources</Link>,
      key: '/dashboard/resources',
    },
    {
      label: <Link href="/dashboard/bookings">My Bookings</Link>,
      key: '/dashboard/bookings',
    },
    {
      label: <Link href="/dashboard/profile">Profile</Link>,
      key: '/dashboard/profile',
    },
    { label: <Link href="/auth/logout">Logout</Link>, key: '/auth/logout' },
  ];

  const currentMenu = role === 'ADMIN' ? adminMenu : userMenu;

  // Active item highlight
  const activeKey = '/' + pathname.split('/').slice(1, 4).join('/');

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          {/* Top Navbar */}
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingInline: 16,
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <div
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              Campus Resource Management
            </div>

            {/* Desktop Menu */}
            <div className="desktop-menu" style={{ flex: 1, marginLeft: 40 }}>
              <Menu
                mode="horizontal"
                theme="dark"
                selectedKeys={[activeKey]}
                items={currentMenu}
                style={{ display: 'flex' }}
              />
            </div>

            {/* Mobile Hamburger */}
            <Button
              className="mobile-menu-btn"
              type="text"
              icon={<MenuOutlined style={{ color: 'white', fontSize: 22 }} />}
              onClick={() => setDrawerOpen(true)}
            />
          </Header>

          {/* Mobile Drawer Menu */}
          <Drawer
            title="Menu"
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            bodyStyle={{ padding: 0 }}
          >
            <Menu
              mode="inline"
              selectedKeys={[activeKey]}
              items={currentMenu}
              onClick={() => setDrawerOpen(false)}
            />
          </Drawer>

          {/* PAGE CONTENT */}
          <Content style={{ padding: '20px' }}>{children}</Content>
        </Layout>

        {/* RESPONSIVE CSS */}
        <style jsx global>{`
          /* Hide desktop menu on small screens */
          @media (max-width: 768px) {
            .desktop-menu {
              display: none;
            }
            .mobile-menu-btn {
              display: block;
            }
          }

          /* Hide hamburger button on desktop */
          @media (min-width: 769px) {
            .mobile-menu-btn {
              display: none;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
