import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginScreen = () => {
  const navigate = useNavigate(); // Dùng để chuyển trang
  const [loading, setLoading] = useState(false); // Trạng thái loading của nút

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 1. Gọi API Login (Cổng 5000)
      // Lưu ý: Đảm bảo Backend đang chạy ở port 5000
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        username: values.username,
        password: values.password,
      });

      // 2. Nếu thành công:
      message.success('Đăng nhập thành công!');
      
      // Lưu thông tin user vào bộ nhớ trình duyệt (để giữ trạng thái đăng nhập)
      localStorage.setItem('userInfo', JSON.stringify(data));

      // 3. Chuyển hướng sang trang Dashboard (hoặc trang chủ)
      navigate('/'); 
      
    } catch (error) {
      // 4. Xử lý lỗi
      const errorMsg = error.response && error.response.data.message
        ? error.response.data.message
        : 'Lỗi kết nối Server';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          BlueMoon Admin Login
        </Title>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large" // Làm form to đẹp hơn chút
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập Tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%' }}
              loading={loading} // Hiệu ứng xoay vòng khi đang gọi API
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginScreen;