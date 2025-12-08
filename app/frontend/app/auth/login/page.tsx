'use client';

import { Form, Input, Button, Card, message } from 'antd';
import { loginUser } from '@/app/services/auth';
import { useRouter } from 'next/navigation';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const res = await loginUser(values);

      // Save JWT in localStorage (or cookie)
      document.cookie = `token=${res.token}; path=/;`;

      message.success('Login successful!');
      router.push('/dashboard');
    } catch (error: unknown) {
      // SAFEST error handling (no any, no AxiosError needed)
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        message.error(err.response?.data?.message || 'Invalid Credentials');
      } else {
        message.error('Invalid Credentials');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 50 }}>
      <Card title="Login" style={{ width: 400 }}>
        <Form<LoginFormValues>
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input autoComplete="new-email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
