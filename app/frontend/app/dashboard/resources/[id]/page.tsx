'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Tag, message, TimePicker } from 'antd';
import axios from '../../../services/api';

interface Resource {
  id: string;
  name: string;
  description: string;
  quantity: number;
  status: string;
  requiresApproval: boolean;
}

// NORMALIZE TIME → convert "10:00 am" → "10am"
function normalizeTime(str: string) {
  return str
    .replace(/:\d+/g, '') // remove :00
    .replace(/\s+/g, '') // remove spaces
    .toLowerCase(); // convert "AM" → "am"
}

const ResourceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  // FETCH RESOURCE DETAILS
  const fetchResource = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Resource>(`/resources/${id}`);
      setResource(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load resource');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  // HANDLE BOOKING
  const handleBooking = async () => {
    if (!fromDate || !toDate) {
      return message.warning('Please select booking times');
    }

    try {
      await axios.post('/bookings', {
        resourceId: id,
        startTime: fromDate,
        endTime: toDate,
      });

      message.success('Booking successful!');
      router.push('/dashboard/bookings');
    } catch (err) {
      console.error(err);
      message.error('Booking failed. Please try again.');
    }
  };

  if (!resource) return <p>Loading...</p>;

  const normalizedStatus = resource.status.toLowerCase();
  const isAvailable = normalizedStatus === 'available';

  return (
    <Card
      style={{ margin: 20, maxWidth: 650 }}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0 }}>Resource Details</h3>

          <Button
            type="default"
            onClick={() => router.push('/dashboard/resources')}
          >
            ← Back to Resources
          </Button>
        </div>
      }
    >
      <h2>{resource.name}</h2>
      <p>{resource.description}</p>

      <p>
        <strong>Quantity:</strong> {resource.quantity}
      </p>

      <p>
        <strong>Status:</strong>{' '}
        <Tag color={isAvailable ? 'green' : 'red'}>
          {normalizedStatus.toUpperCase()}
        </Tag>
      </p>

      {/* ⭐ BOOKING TIME PICKER SECTION */}
      <div style={{ marginTop: 25 }}>
        <h3 style={{ marginBottom: 10 }}>Select Booking Times</h3>

        {/* Styled Wrapper for TimePicker */}
        <div
          style={{
            width: '100%',
            border: '1px solid #d9d9d9',
            borderRadius: 8,
            padding: '8px 12px',
            background: '#fff',
            marginBottom: 20,
          }}
        >
          <TimePicker.RangePicker
            format="h:mm a"
            minuteStep={15}
            style={{
              width: '100%',
              border: 'none',
            }}
            popupStyle={{
              borderRadius: 10,
              padding: 5,
            }}
            onChange={(times) => {
              const [start, end] = times ?? [null, null];

              const startRaw = start ? start.format('h:mm a') : null;
              const endRaw = end ? end.format('h:mm a') : null;

              setFromDate(startRaw ? normalizeTime(startRaw) : null);
              setToDate(endRaw ? normalizeTime(endRaw) : null);
            }}
          />
        </div>

        <Button
          type="primary"
          disabled={!isAvailable}
          onClick={handleBooking}
          block
          style={{
            height: 45,
            fontSize: 16,
            borderRadius: 8,
          }}
        >
          {isAvailable ? 'Book Resource' : 'Already Booked'}
        </Button>
      </div>
    </Card>
  );
};

export default ResourceDetailsPage;
