'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/services/api';

type AdminUserDetails = {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  isActive: boolean;
};

type EditUserFormValues = {
  name: string;
  email: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
};

export default function EditUserPage() {
  const params = useParams();
  const id = params?.id;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      try {
        const res = await api.get<AdminUserDetails>(`/users/${id}`);
        form.setFieldsValue({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });
      } catch (err) {
        console.error(err);
        message.error('Failed to load user');
      }
    };
    loadUser();
  }, [id, form]);

  const onFinish = async (values: EditUserFormValues) => {
    try {
      setLoading(true);
      await api.patch(`/users/${id}`, values);
      message.success('User updated');
      router.push('/dashboard/admin/users');
    } catch {
      message.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Edit User</h1>

        {/* ⭐ NEW BUTTON ADDED HERE */}
        <Button
          type="default"
          onClick={() => router.push(`/dashboard/admin/users/${id}/bookings`)}
        >
          View Bookings
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="STUDENT">STUDENT</Select.Option>
            <Select.Option value="STAFF">STAFF</Select.Option>
            <Select.Option value="ADMIN">ADMIN</Select.Option>
          </Select>
        </Form.Item>

        <div className="flex gap-2">
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>

          <Button onClick={() => router.back()}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
}
