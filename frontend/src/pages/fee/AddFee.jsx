import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, Switch, Button, message, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const AddFee = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gọi API tạo mới
      await axios.post('http://localhost:5000/api/fees', values);
      message.success('Thêm khoản phí thành công!');
      navigate('/fees'); // Quay lại danh sách
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Lỗi khi thêm phí');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/fees')} />
          <span>Thêm Khoản Phí Mới</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isMandatory: true, // Mặc định là bắt buộc
          calculationUnit: 'FIXED', // Mặc định là cố định
          isActive: true
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Cột 1 */}
          <div>
            <Form.Item
              name="name"
              label="Tên khoản phí"
              rules={[{ required: true, message: 'Vui lòng nhập tên phí' }]}
            >
              <Input placeholder="VD: Phí quản lý, Phí gửi xe..." />
            </Form.Item>

            <Form.Item
              name="unitPrice"
              label="Đơn giá (VNĐ)"
              rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>
          </div>

          {/* Cột 2 */}
          <div>
            <Form.Item
              name="calculationUnit"
              label="Đơn vị tính"
              rules={[{ required: true, message: 'Vui lòng chọn đơn vị tính' }]}
            >
              <Select>
                <Option value="FIXED">Cố định (Theo hộ)</Option>
                <Option value="PER_M2">Theo diện tích (m²)</Option>
                <Option value="PER_HEAD">Theo nhân khẩu (người)</Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="isMandatory" 
              label="Loại phí" 
              valuePropName="checked"
            >
              <Switch checkedChildren="Bắt buộc" unCheckedChildren="Tự nguyện" />
            </Form.Item>
          </div>
        </div>

        <Form.Item name="description" label="Mô tả chi tiết">
          <TextArea rows={3} placeholder="Ghi chú thêm về khoản phí này..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            Lưu khoản phí
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddFee;