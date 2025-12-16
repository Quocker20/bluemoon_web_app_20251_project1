import React, { useState } from 'react';
import { Card, Form, Input, Button, InputNumber, Space, Divider, Row, Col, message } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const AddHousehold = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axiosClient.post('/households', values);
      message.success('Thêm hộ khẩu mới thành công!');
      navigate('/households');
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi khi thêm mới';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      style={{ maxWidth: 800, margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      title={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/households')} />
          <span>Thêm Hộ Khẩu Mới</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ residents: [] }}
      >
        <Divider orientation="left">Thông tin Hộ khẩu</Divider>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="householdNumber"
              label="Số hộ khẩu (Căn hộ)"
              rules={[{ required: true, message: 'Vui lòng nhập số hộ khẩu' }]}
            >
              <Input placeholder="VD: A-101" />
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

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="ownerName"
              label="Tên Chủ hộ"
              rules={[{ required: true, message: 'Vui lòng nhập tên chủ hộ' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên chủ hộ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ownerCCCD"
              label="CCCD/CMND Chủ hộ"
              rules={[{ required: true, message: 'Vui lòng nhập CCCD chủ hộ' }]}
            >
              <Input placeholder="Nhập số thẻ căn cước" />
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item
              name="phone"
              label="Số điện thoại liên hệ"
              rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Danh sách Nhân khẩu đi kèm</Divider>
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
                    <Input placeholder="Quan hệ (VD: Con, Vợ)" />
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
            Lưu Hộ Khẩu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddHousehold;