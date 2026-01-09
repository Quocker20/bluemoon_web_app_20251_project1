// File: frontend/src/components/RegisterModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Option } = Select;

const RegisterModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // Gọi API Register có sẵn
      await axiosClient.post('/auth/register', {
        username: values.username,
        password: values.password,
        role: values.role, 
        // resident_id: ... (Tạm thời chưa xử lý chọn cư dân cụ thể để đơn giản hóa)
      });

      message.success(`Đã tạo tài khoản "${values.username}" thành công!`);
      
      // Reset form và đóng modal
      form.resetFields();
      onClose();

    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi khi tạo tài khoản';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đăng ký tài khoản mới (Admin)"
      open={open}
      onCancel={onClose}
      footer={null} // Ẩn nút default, dùng nút trong Form
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleRegister}
        initialValues={{ role: 'cu_dan' }} // Mặc định là Cư dân
      >
        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: 'Vui lòng nhập username' }]}
        >
          <Input placeholder="Ví dụ: user01" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu..." />
        </Form.Item>

        <Form.Item
          name="role"
          label="Phân quyền (Role)"
          rules={[{ required: true, message: 'Vui lòng chọn quyền' }]}
        >
          <Select>
            <Option value="cu_dan">Cư dân (User)</Option>
            <Option value="bqt_admin">Ban Quản Trị (Admin)</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginTop: 20 }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} icon={<UserAddOutlined />}>
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;