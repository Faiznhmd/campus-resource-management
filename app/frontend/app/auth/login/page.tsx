// frontend/app/auth/login/page.tsx
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

      console.log('LOGIN RESPONSE:', res);

      // SAVE TOKEN CORRECTLY
      document.cookie = `token=${res.access_token}; path=/; SameSite=Lax;`;
      localStorage.setItem('token', res.access_token);

      message.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      message.error('Invalid Credentials');
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
