'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import type { UserType } from '../../services/types';
import axios from '../../services/api';
import { updateMyProfile } from '../../services/user';

export default function ProfilePage() {
  const [form] = Form.useForm<UserType>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get<UserType>('/users/me');
      form.setFieldsValue(res.data); // user sees their own info
    } catch {
      message.error('Failed to load profile');
    }
  };

  const onSubmit = async (values: Partial<UserType>) => {
    try {
      setLoading(true);
      await updateMyProfile(values);
      message.success('Profile updated successfully!');
    } catch {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Card title="My Profile" className="w-full max-w-xl shadow-md">
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Input disabled />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
}
