'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Tag, message, DatePicker } from 'antd';
import axios from '../../../services/api';
import { Dayjs } from 'dayjs';

interface Resource {
  id: string;
  name: string;
  description: string;
  quantity: number;
  status: string;
}

const ResourceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

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

  const handleBooking = async () => {
    if (!fromDate || !toDate) {
      return message.warning('Please select booking dates');
    }

    try {
      await axios.post('/bookings', {
        resourceId: id,
        fromDate,
        toDate,
      });

      message.success('Booking successful!');
      router.push('/dashboard/bookings');
    } catch (err: unknown) {
      console.error(err);

      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        message.error(errorObj.response?.data?.message || 'Booking failed');
      } else {
        message.error('Booking failed');
      }
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

      <div style={{ marginTop: 20 }}>
        <h3>Select Booking Dates</h3>

        <DatePicker.RangePicker
          style={{ width: '100%', marginBottom: 20 }}
          onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
            const [start, end] = dates ?? [null, null];

            setFromDate(start ? start.format('YYYY-MM-DD') : null);
            setToDate(end ? end.format('YYYY-MM-DD') : null);
          }}
        />

        <Button
          type="primary"
          disabled={!isAvailable}
          onClick={handleBooking}
          block
        >
          {isAvailable ? 'Book Resource' : 'Already Booked'}
        </Button>
      </div>
    </Card>
  );
};

export default ResourceDetailsPage;
