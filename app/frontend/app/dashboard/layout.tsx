// // 'use client';

// // import { Layout, Menu } from 'antd';
// // import Link from 'next/link';
// // import { usePathname } from 'next/navigation';
// // import { useEffect, useState } from 'react';
// // import api from '@/app/services/api';

// // const { Sider, Content, Header } = Layout;

// // interface UserMeResponse {
// //   id: number;
// //   email: string;
// //   role: string;
// // }

// // export default function DashboardLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const pathname = usePathname();
// //   const [role, setRole] = useState<string | null>(null);

// //   // Fetch logged-in user data
// //   useEffect(() => {
// //     const fetchUser = async () => {
// //       try {
// //         const res = await api.get<UserMeResponse>('/auth/me'); // make sure you have this endpoint
// //         setRole(res.data.role);
// //       } catch (err) {
// //         console.log('Failed to fetch user');
// //       }
// //     };

// //     fetchUser();
// //   }, []);

// //   // Menu items for ADMIN
// //   const adminItems = [
// //     { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },

// //     {
// //       label: 'Resources',
// //       key: 'resources',
// //       children: [
// //         {
// //           label: <Link href="/dashboard/admin/resources">All Resources</Link>,
// //           key: '/dashboard/admin/resources',
// //         },
// //         {
// //           label: (
// //             <Link href="/dashboard/admin/resources/create">
// //               Create Resource
// //             </Link>
// //           ),
// //           key: '/dashboard/admin/resources/create',
// //         },
// //       ],
// //     },

// //     {
// //       label: <Link href="/dashboard/admin/bookings">Bookings</Link>,
// //       key: '/dashboard/admin/bookings',
// //     },

// //     {
// //       label: <Link href="/dashboard/admin/users">Users</Link>,
// //       key: '/dashboard/admin/users',
// //     },
// //   ];

// //   // Menu items for NORMAL USER
// //   const userItems = [
// //     { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },

// //     {
// //       label: <Link href="/dashboard/resources">Browse Resources</Link>,
// //       key: '/resources',
// //     },

// //     {
// //       label: <Link href="/dashboard/bookings">My Bookings</Link>,
// //       key: '/dashboard/bookings',
// //     },

// //     {
// //       label: <Link href="/dashboard/profile">Profile</Link>,
// //       key: '/dashboard/profile',
// //     },
// //   ];

// //   return (
// //     <Layout style={{ minHeight: '100vh' }}>
// //       <Sider theme="dark">
// //         <Menu
// //           theme="dark"
// //           mode="inline"
// //           selectedKeys={[pathname]}
// //           items={role === 'ADMIN' ? adminItems : userItems}
// //         />
// //       </Sider>

// //       <Layout>
// //         <Header style={{ background: '#fff', paddingLeft: 20, fontSize: 20 }}>
// //           Campus Resource Management
// //         </Header>

// //         <Content style={{ margin: '20px', background: '#fff', padding: 20 }}>
// //           {children}
// //         </Content>
// //       </Layout>
// //     </Layout>
// //   );
// // }

// 'use client';

// import { Layout, Menu } from 'antd';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import api from '@/app/services/api';

// const { Sider, Content, Header } = Layout;

// interface UserMeResponse {
//   id: number;
//   email: string;
//   role: string;
// }

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [role, setRole] = useState<string | null>(null);

//   // Fetch logged-in user data
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await api.get<UserMeResponse>('/auth/me');
//         setRole(res.data.role);
//       } catch (err) {
//         console.log('Failed to fetch user');
//       }
//     };

//     fetchUser();
//   }, []);

//   /**
//    * ⭐ FIX: Ensure correct menu selection for nested routes such as:
//    * /dashboard/admin/users/12/edit
//    * /dashboard/admin/users/12/bookings
//    *
//    * We extract only: /dashboard/admin/users
//    */
//   const basePath = '/' + pathname.split('/').slice(1, 4).join('/');

//   // Menu items for ADMIN
//   const adminItems = [
//     { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },

//     {
//       label: 'Resources',
//       key: 'resources',
//       children: [
//         {
//           label: <Link href="/dashboard/admin/resources">All Resources</Link>,
//           key: '/dashboard/admin/resources',
//         },
//         {
//           label: (
//             <Link href="/dashboard/admin/resources/create">
//               Create Resource
//             </Link>
//           ),
//           key: '/dashboard/admin/resources/create',
//         },
//       ],
//     },

//     {
//       label: <Link href="/dashboard/admin/bookings">Bookings</Link>,
//       key: '/dashboard/admin/bookings',
//     },

//     {
//       label: <Link href="/dashboard/admin/users">Users</Link>,
//       key: '/dashboard/admin/users',
//     },
//   ];

//   // Menu items for NORMAL USER
//   const userItems = [
//     { label: <Link href="/dashboard">Dashboard</Link>, key: '/dashboard' },

//     {
//       label: <Link href="/dashboard/resources">Browse Resources</Link>,
//       key: '/dashboard/resources',
//     },

//     {
//       label: <Link href="/dashboard/bookings">My Bookings</Link>,
//       key: '/dashboard/bookings',
//     },

//     {
//       label: <Link href="/dashboard/profile">Profile</Link>,
//       key: '/dashboard/profile',
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider theme="dark">
//         <Menu
//           theme="dark"
//           mode="inline"
//           // ⭐ FIXED SELECTION FOR NESTED ROUTES
//           selectedKeys={[basePath]}
//           items={role === 'ADMIN' ? adminItems : userItems}
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

import { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
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

  // Fetch logged-in user role
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

  // ADMIN NAV ITEMS
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

  // USER NAV ITEMS
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

  // Highlight active path properly
  const activeKey = '/' + pathname.split('/').slice(1, 4).join('/');

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          {/* TOP NAVBAR */}
          <Header
            style={{ display: 'flex', alignItems: 'center', paddingInline: 25 }}
          >
            <div
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
                marginRight: 40,
              }}
            >
              Campus Resource Management
            </div>

            <Menu
              mode="horizontal"
              theme="dark"
              selectedKeys={[activeKey]}
              items={role === 'ADMIN' ? adminMenu : userMenu}
              style={{ flex: 1 }}
            />
          </Header>

          {/* PAGE CONTENT */}
          <Content style={{ padding: '24px 40px' }}>{children}</Content>
        </Layout>
      </body>
    </html>
  );
}
