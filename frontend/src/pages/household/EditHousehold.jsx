// File: frontend/src/pages/household/EditHousehold.jsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, InputNumber, Space, Typography, Divider, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const { Title } = Typography;

const EditHousehold = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        const response = await axiosClient.get(`/households/${id}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        toast.error('Không tìm thấy hộ khẩu!');
        console.log(error);
        navigate('/households');
      } finally {
        setDataLoading(false);
      }
    };
    fetchHousehold();
  }, [id, form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axiosClient.put(`/households/${id}`, values);
      toast.success('Cập nhật thành công!');
      navigate('/households');
    } catch (error) {
       toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/households')}>
          Quay lại
        </Button>
      </div>
      
      <Title level={3} style={{ textAlign: 'center' }}>Sửa Hộ Khẩu</Title>

      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Divider orientation="left">Thông tin Hộ khẩu</Divider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item label="Số hộ khẩu" name="householdNumber" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          
          <Form.Item label="Tên chủ hộ" name="ownerName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {/* THÊM SĐT */}
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Diện tích (m2)" name="area" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </div>

        <Divider orientation="left">Danh sách Nhân khẩu</Divider>
        <Form.List name="residents">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'residentName']}
                    rules={[{ required: true, message: 'Thiếu tên' }]}
                  >
                    <Input placeholder="Họ và tên" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'cccd']}
                  >
                    <Input placeholder="CCCD/CMND" />
                  </Form.Item>
                   <Form.Item
                    {...restField}
                    name={[name, 'relationToOwner']}
                    rules={[{ required: true, message: 'Thiếu quan hệ' }]}
                  >
                    <Input placeholder="Quan hệ" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm thành viên
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block>
            Lưu Thay Đổi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditHousehold;