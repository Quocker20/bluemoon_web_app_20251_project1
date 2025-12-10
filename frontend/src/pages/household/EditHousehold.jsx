// File: frontend/src/pages/household/EditHousehold.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, InputNumber, Space, Divider, Row, Col, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const EditHousehold = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        const response = await axiosClient.get(`/households/${id}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        toast.error('Không tìm thấy thông tin hộ khẩu');
        console.log(error);
        navigate('/households');
      } finally {
        setFetching(false);
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
      const msg = error.response?.data?.message || 'Lỗi khi cập nhật';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    // THÊM style maxWidth và margin auto
    <Card 
      style={{ maxWidth: 800, margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      title={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/households')} />
          <span>Chỉnh sửa Hộ Khẩu</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Divider orientation="left">Thông tin Hộ khẩu</Divider>
        
        {/* Hàng 1 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="householdNumber"
              label="Số hộ khẩu (Căn hộ)"
              rules={[{ required: true, message: 'Vui lòng nhập số hộ khẩu' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="area"
              label="Diện tích (m²)"
              rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 2 */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="ownerName"
              label="Tên Chủ hộ"
              rules={[{ required: true, message: 'Vui lòng nhập tên chủ hộ' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 3 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ownerCCCD"
              label="CCCD/CMND Chủ hộ"
              rules={[{ required: true, message: 'Vui lòng nhập CCCD chủ hộ' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item
              name="phone"
              label="Số điện thoại liên hệ"
              rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Danh sách Nhân khẩu</Divider>
        <Form.List name="residents">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'residentName']}
                    rules={[{ required: true, message: 'Nhập tên' }]}
                  >
                    <Input placeholder="Họ tên thành viên" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'relationToOwner']}
                    rules={[{ required: true, message: 'Nhập quan hệ' }]}
                  >
                    <Input placeholder="Quan hệ" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'cccd']}
                  >
                    <Input placeholder="CCCD (nếu có)" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm nhân khẩu
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 20, textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            Lưu Thay Đổi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditHousehold;