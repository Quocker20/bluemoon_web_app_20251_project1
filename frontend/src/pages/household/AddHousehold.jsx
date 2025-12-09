// File: frontend/src/pages/household/AddHousehold.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Card, InputNumber, Space, Typography, Divider, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

const AddHousehold = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axiosClient.post('/households', values);
      toast.success('Thêm hộ khẩu thành công!');
      navigate('/admin/households');
    } catch (error) {
      toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/households')}>
          Quay lại
        </Button>
      </div>
      
      <Title level={3} style={{ textAlign: 'center' }}>Thêm Hộ Khẩu Mới</Title>

      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        {/* === THÔNG TIN CHUNG === */}
        <Divider orientation="left">Thông tin Hộ khẩu</Divider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item label="Số hộ khẩu" name="householdNumber" rules={[{ required: true, message: 'Nhập số sổ!' }]}>
            <Input placeholder="VD: P101" />
          </Form.Item>
          
          <Form.Item label="Tên chủ hộ" name="ownerName" rules={[{ required: true, message: 'Nhập tên chủ hộ!' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          {/* ĐÃ THÊM: SỐ ĐIỆN THOẠI (BẮT BUỘC THEO MODEL) */}
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập SĐT liên hệ!' }]}>
            <Input placeholder="0988xxxxxx" />
          </Form.Item>

          <Form.Item label="Diện tích (m2)" name="area" rules={[{ required: true, message: 'Nhập diện tích!' }]}>
            <InputNumber style={{ width: '100%' }} min={1} placeholder="VD: 70" />
          </Form.Item>

           {/* ĐÃ THÊM: ĐỊA CHỈ (NẾU MODEL CẦN, TẠM THỜI ĐỂ OPTIONAL HOẶC REQUIRED TÙY BẠN) */}
           {/* Nếu model không bắt buộc address thì có thể bỏ qua, nhưng thường UI nên có */}
        </div>

        {/* === DANH SÁCH NHÂN KHẨU (FORM ĐỘNG) === */}
        <Divider orientation="left">Danh sách Nhân khẩu</Divider>
        <Form.List name="residents">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8, borderBottom: '1px dashed #ccc', paddingBottom: 8 }} align="baseline">
                  {/* SỬA: name -> residentName */}
                  <Form.Item
                    {...restField}
                    name={[name, 'residentName']}
                    rules={[{ required: true, message: 'Thiếu tên' }]}
                  >
                    <Input placeholder="Họ và tên" />
                  </Form.Item>

                   {/* SỬA: identityCard -> cccd */}
                  <Form.Item
                    {...restField}
                    name={[name, 'cccd']}
                  >
                    <Input placeholder="CCCD/CMND" />
                  </Form.Item>

                  {/* THÊM: relationToOwner */}
                  <Form.Item
                    {...restField}
                    name={[name, 'relationToOwner']}
                    rules={[{ required: true, message: 'Nhập quan hệ' }]}
                    style={{ minWidth: 120 }}
                  >
                    <Input placeholder="Quan hệ (Vợ/Con...)" />
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
            Lưu Hộ Khẩu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddHousehold;