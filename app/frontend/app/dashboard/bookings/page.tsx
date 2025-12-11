'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import api from '../../services/api';
import { useRouter } from 'next/navigation';

interface ResourceInfo {
  id: number;
  name: string;
  description?: string;
}

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  resource: ResourceInfo;
}

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  // fetch bookings
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get<Booking[]>('/bookings/me');
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // pagination
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));
  const [page, setPage] = useState(1);
  const paginated = bookings.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const go = (n: number) => setPage(Math.min(Math.max(n, 1), totalPages));

  // desktop columns
  const columns = [
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      render: (r: ResourceInfo) => <strong>{r?.name}</strong>,
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (t: string) => new Date(t).toLocaleString(),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (t: string) => new Date(t).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: Booking['status']) => (
        <Tag
          color={
            s === 'APPROVED' ? 'green' : s === 'PENDING' ? 'orange' : 'red'
          }
        >
          {s}
        </Tag>
      ),
    },
    {
      title: 'Booked On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t: string) => new Date(t).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: Booking) => (
        <Button
          type="link"
          onClick={() =>
            router.push(`/dashboard/resources/${record.resource.id}`)
          }
        >
          Continue Booking
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 flex justify-center">
      {/* container adapts: full width on mobile, wide on desktop */}
      <div className="w-full max-w-5xl">
        {/* card wrapper */}
        <div className="bg-white rounded-2xl shadow-md p-5 md:p-7">
          {/* Header: stacks on mobile, inline on md+ */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6">
            <div>
              {/* Title: smaller on mobile, larger on md+ */}
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-tight">
                My Bookings
              </h2>
              {/* small subtitle if you want (optional) */}
              <p className="text-sm text-gray-500 mt-1 md:mt-2">
                Manage and continue your bookings
              </p>
            </div>

            {/* right side button: align start on mobile, end on desktop */}
            <div className="flex md:items-center">
              <Button
                type="primary"
                onClick={() => router.push('/dashboard/resources')}
                className="!rounded-lg !px-4 !py-1"
                size={isMobile ? 'small' : 'middle'}
              >
                All Resources
              </Button>
            </div>
          </div>

          {/* EMPTY STATE */}
          {!loading && bookings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">
                Browse resources and make your first booking.
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => router.push('/dashboard/resources')}
              >
                Browse Resources
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table (md+) */}
              {!isMobile && (
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <Table
                    rowKey="id"
                    dataSource={paginated}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    className="min-w-full"
                  />
                </div>
              )}

              {/* Mobile cards */}
              {isMobile && (
                <div className="flex flex-col gap-4">
                  {paginated.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white border border-gray-100 rounded-lg shadow-sm p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                          <div className="text-lg font-semibold text-gray-800">
                            {b.resource.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            <div>
                              <span className="font-medium text-gray-700">
                                Start:
                              </span>{' '}
                              {new Date(b.startTime).toLocaleString()}
                            </div>
                            <div className="mt-1">
                              <span className="font-medium text-gray-700">
                                End:
                              </span>{' '}
                              {new Date(b.endTime).toLocaleString()}
                            </div>
                            <div className="mt-3">
                              <Tag
                                color={
                                  b.status === 'APPROVED'
                                    ? 'green'
                                    : b.status === 'PENDING'
                                    ? 'orange'
                                    : 'red'
                                }
                              >
                                {b.status}
                              </Tag>
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0 self-center">
                          <Button
                            type="link"
                            onClick={() =>
                              router.push(
                                `/dashboard/resources/${b.resource.id}`
                              )
                            }
                          >
                            Continue Booking
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination (Tailwind) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={prev}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    ←
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const n = i + 1;
                      const active = n === page;
                      return (
                        <button
                          key={n}
                          onClick={() => go(n)}
                          className={`px-3 py-1 rounded-md font-medium transition ${
                            active
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={next}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
