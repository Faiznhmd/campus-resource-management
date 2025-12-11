'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Tag, message, TimePicker, Alert } from 'antd';
import api from '@/app/services/api';

interface BookedSlot {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
}
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
interface Resource {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  status: string;
  requiresApproval: boolean;
}

function formatTime(str: string) {
  return str.replace(/\s+/g, '').toLowerCase();
}

function toDateToday(timeStr: string): Date | null {
  const cleaned = timeStr?.replace(/\s+/g, '').toLowerCase();
  const match = cleaned?.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;

  if (match[3] === 'pm' && hour !== 12) hour += 12;
  if (match[3] === 'am' && hour === 12) hour = 0;

  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute
  );
}

function toMillis(iso: string) {
  return new Date(iso).getTime();
}

export default function ResourceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [resource, setResource] = useState<Resource | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  /* Fetch resource + bookings */
  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await api.get<Resource>(`/resources/${id}`);
      setResource(res.data);

      const bookingsRes = await api.get<BookedSlot[]>(
        `/bookings/resource/${id}`
      );
      setBookedSlots(bookingsRes.data || []);
    } catch (err) {
      message.error('Failed to load resource.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /* Check current active booking */
  const activeBooking = useMemo(() => {
    const now = Date.now();
    return bookedSlots.find((slot) => {
      if (['COMPLETED', 'REJECTED'].includes(slot.status)) return false;
      const start = toMillis(slot.startTime);
      const end = toMillis(slot.endTime);
      return now >= start && now < end;
    });
  }, [bookedSlots]);

  const isResourceAvailable = useMemo(() => {
    if (!resource) return false;
    if (activeBooking) return false;
    return resource.status.toUpperCase() === 'AVAILABLE';
  }, [resource, activeBooking]);

  const availableAgainAt = activeBooking
    ? new Date(activeBooking.endTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  /* overlap logic */
  const isOverlapping = (s: string, e: string) => {
    const start = toDateToday(s)?.getTime();
    const end = toDateToday(e)?.getTime();
    if (!start || !end) return false;

    return bookedSlots.some((slot) => {
      if (['COMPLETED', 'REJECTED'].includes(slot.status)) return false;
      const st = toMillis(slot.startTime);
      const en = toMillis(slot.endTime);
      return start < en && end > st;
    });
  };

  /* Booking */
  const handleBooking = async () => {
    if (!startTime || !endTime) return message.warning('Choose a time.');

    if (isOverlapping(startTime, endTime)) {
      return message.error('This time slot is already booked.');
    }

    try {
      setLoading(true);
      await api.post('/bookings', {
        resourceId: Number(id),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      });

      message.success(
        resource?.requiresApproval
          ? 'Request sent — waiting for approval.'
          : 'Booking confirmed!'
      );

      await fetchData();
      router.push('/dashboard/bookings');
    } catch (err) {
      const error = err as ApiError;
      const backendMessage =
        error.response?.data?.message || 'Booking failed. Please try again.';
      message.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!resource) return <div className="p-6">Loading...</div>;

  /* ---------------- UI SECTION ---------------- */

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Resource Details</h1>
          <Button onClick={() => router.push('/dashboard/resources')}>
            ← Back
          </Button>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-semibold mb-1">{resource.name}</h2>
        {resource.description && (
          <p className="text-gray-600 mb-4">{resource.description}</p>
        )}

        {/* Status */}
        <div className="mb-5 text-[15px]">
          <span className="font-medium">Status:</span>{' '}
          <Tag color={isResourceAvailable ? 'green' : 'red'}>
            {isResourceAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
          </Tag>
        </div>

        {/* Active Booking */}
        {activeBooking && (
          <Alert
            type="warning"
            message={`Currently booked — free at ${availableAgainAt}`}
            showIcon
            className="rounded-md mb-5"
          />
        )}

        {/* Booked Today */}
        <Alert
          type="info"
          className="rounded-md mb-6"
          message={
            <div>
              <b>Already Booked Today</b>
              <ul className="mt-2 list-disc ml-5">
                {bookedSlots.length === 0 && (
                  <li className="text-gray-700">No bookings today</li>
                )}

                {bookedSlots.map((slot) => (
                  <li key={slot.id} className="mb-1">
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(slot.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    <Tag
                      color={slot.status === 'COMPLETED' ? 'blue' : 'orange'}
                    >
                      {slot.status}
                    </Tag>
                  </li>
                ))}
              </ul>
            </div>
          }
        />

        {/* Booking Time */}
        <h3 className="font-semibold text-lg mb-2  mt-2">
          Select Booking Time
        </h3>

        <TimePicker.RangePicker
          format="h:mm a"
          minuteStep={15}
          className="w-full h-11 rounded-lg"
          onChange={(vals) => {
            const [s, e] = vals ?? [];
            setStartTime(s ? s.format('h:mm a') : null);
            setEndTime(e ? e.format('h:mm a') : null);
          }}
        />

        {/* Submit Button */}
        <Button
          type="primary"
          block
          disabled={!isResourceAvailable}
          onClick={handleBooking}
          className="mt-5 h-11 text-[16px] rounded-lg"
        >
          {isResourceAvailable
            ? resource.requiresApproval
              ? 'Request Booking'
              : 'Book Now'
            : 'Not Available'}
        </Button>
      </div>
    </div>
  );
}
