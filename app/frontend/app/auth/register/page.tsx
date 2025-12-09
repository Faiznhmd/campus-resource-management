'use client';

import { Form, Input, Button, Card, Select, message } from 'antd';
import { registerUser } from '@/app/services/auth';
import { useRouter } from 'next/navigation';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      await registerUser(values);
      message.success('Registration successful!');
      router.push('/auth/login');
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        message.error(err.response?.data?.message || 'Registration failed');
      } else {
        message.error('Registration failed');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 50,
      }}
    >
      <Card title="Register" style={{ width: 450 }}>
        <Form<RegisterFormValues>
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input autoComplete="new-name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input autoComplete="new-email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value="STUDENT">Student</Select.Option>
              <Select.Option value="STAFF">Staff</Select.Option>
              <Select.Option value="STAFF">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
}
