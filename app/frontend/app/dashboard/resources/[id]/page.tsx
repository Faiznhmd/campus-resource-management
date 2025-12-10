'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Tag, message, TimePicker, Alert } from 'antd';
import api from '@/app/services/api';

interface BookedSlot {
  id: number;
  startTime: string; // ISO string from backend
  endTime: string; // ISO string from backend
  status: string; // PENDING | APPROVED | REJECTED | COMPLETED
}

interface Resource {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  status: string; // e.g. 'AVAILABLE' | 'BOOKED' etc.
  requiresApproval: boolean;
}
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

/** normalize "3:30 PM" -> "3:30pm" */
function formatTime(str: string) {
  return str.replace(/\s+/g, '').toLowerCase();
}

/** Convert friendly time ("3pm" / "3:30pm") → Date object for today */
function toDateToday(timeStr: string): Date | null {
  if (!timeStr) return null;
  const cleaned = timeStr.replace(/\s+/g, '').toLowerCase();
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toLowerCase();

  if (period === 'pm' && hour !== 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;

  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0
  );
}

/** Helper: parse ISO timestamp to number (ms) */
function toMillis(iso: string) {
  return new Date(iso).getTime();
}

export default function ResourceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [resource, setResource] = useState<Resource | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const [startTime, setStartTime] = useState<string | null>(null); // friendly e.g. "3pm"
  const [endTime, setEndTime] = useState<string | null>(null);

  // Fetch resource + today's bookings
  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Resource endpoint calls releasePastBookings() on the server (your backend) so status is updated
      const res = await api.get<Resource>(`/resources/${id}`);
      setResource(res.data);

      const bookingsRes = await api.get<BookedSlot[]>(
        `/bookings/resource/${id}`
      );
      setBookedSlots(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load resource data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // initial + polling
  useEffect(() => {
    fetchData();
    if (!id) return;
    const timer = setInterval(() => {
      fetchData();
    }, 20_000); // refresh every 20s so UI updates as time passes
    return () => clearInterval(timer);
  }, [fetchData, id]);

  // ---------------------------
  // active booking detection
  // ---------------------------
  const activeBooking = useMemo(() => {
    const now = Date.now();
    // Only consider PENDING/APPROVED as blocking (we ignore COMPLETED/REJECTED)
    return bookedSlots.find((slot) => {
      if (!slot || !slot.startTime || !slot.endTime) return false;
      if (slot.status === 'COMPLETED' || slot.status === 'REJECTED')
        return false;

      const start = toMillis(slot.startTime);
      const end = toMillis(slot.endTime);

      // active if now is between start (inclusive) and end (exclusive)
      return now >= start && now < end;
    });
  }, [bookedSlots]);

  // The frontend-level availability: blocked if activeBooking exists
  const isResourceAvailable = useMemo(() => {
    if (!resource) return false;
    // if currently occupied by an active booking => not available
    if (activeBooking) return false;
    // otherwise rely on backend status (normalize)
    return resource.status?.toString().toUpperCase() === 'AVAILABLE';
  }, [resource, activeBooking]);

  const availableAgainAt = activeBooking
    ? new Date(activeBooking.endTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  // ---------------------------
  // overlap check before creating booking
  // ---------------------------
  function isOverlapping(newStartStr: string, newEndStr: string) {
    const s = toDateToday(newStartStr);
    const e = toDateToday(newEndStr);
    if (!s || !e) return false;

    const newStart = s.getTime();
    const newEnd = e.getTime();

    return bookedSlots.some((slot) => {
      // ignore completed/rejected
      if (slot.status === 'COMPLETED' || slot.status === 'REJECTED')
        return false;

      const existingStart = toMillis(slot.startTime);
      const existingEnd = toMillis(slot.endTime);

      // overlap condition
      return newStart < existingEnd && newEnd > existingStart;
    });
  }

  // ---------------------------
  // booking handler (posts to backend)
  // ---------------------------
  const handleBooking = async () => {
    if (!startTime || !endTime) {
      return message.warning('Please select booking times.');
    }

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
          ? 'Booking request sent — awaiting admin approval.'
          : 'Booking confirmed!'
      );

      // refresh so UI shows the new booking and disabled state immediately
      await fetchData();

      // optionally redirect user to their bookings page
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

  if (!resource) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <Card
      loading={loading}
      style={{
        margin: 20,
        maxWidth: 780,
        paddingBottom: 20,
        borderRadius: 12,
        boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
      }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            Resource Details
          </span>
          <Button onClick={() => router.push('/dashboard/resources')}>
            ← Back
          </Button>
        </div>
      }
    >
      <h2>{resource.name}</h2>
      {resource.description && <p>{resource.description}</p>}

      <p>
        <strong>Status:</strong>{' '}
        <Tag color={isResourceAvailable ? 'green' : 'red'}>
          {isResourceAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
        </Tag>
      </p>

      {activeBooking && (
        <Alert
          type="warning"
          message={`Currently in use — available again at ${availableAgainAt}`}
          style={{ marginBottom: 15 }}
          showIcon
        />
      )}

      <Alert
        type="info"
        message={
          <div>
            <b>Already Booked Today</b>
            <ul style={{ marginTop: 8 }}>
              {bookedSlots.length === 0 && <li>No bookings today</li>}
              {bookedSlots.map((slot) => (
                <li key={slot.id} style={{ marginBottom: 6 }}>
                  {new Date(slot.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' - '}
                  {new Date(slot.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  <Tag color={slot.status === 'COMPLETED' ? 'blue' : 'orange'}>
                    {slot.status}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        }
        style={{ marginBottom: 20 }}
      />

      <h3>Select Booking Time</h3>

      <TimePicker.RangePicker
        format="h:mm a"
        minuteStep={15}
        style={{ width: '100%' }}
        onChange={(values) => {
          const [s, e] = values ?? [];
          setStartTime(s ? s.format('h:mm a') : null);
          setEndTime(e ? e.format('h:mm a') : null);
        }}
      />

      <Button
        type="primary"
        block
        disabled={!isResourceAvailable}
        onClick={handleBooking}
        style={{ marginTop: 20 }}
      >
        {isResourceAvailable
          ? resource.requiresApproval
            ? 'Request Booking'
            : 'Book Now'
          : 'Not Available'}
      </Button>
    </Card>
  );
}
