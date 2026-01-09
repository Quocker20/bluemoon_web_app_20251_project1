import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Switch, Button, message, Space, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const EditFee = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const { data } = await axiosClient.get(`/fees/${id}`);
        form.setFieldsValue(data);
      } catch (error) {
        message.error('Không tìm thấy thông tin khoản phí');
        console.log(error);
        navigate('/fees');
      } finally {
        setFetching(false);
      }
    };
    fetchFee();
  }, [id, form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axiosClient.put(`/fees/${id}`, values);
      message.success('Cập nhật thành công!');
      navigate('/fees');
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <Card 
      title={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/fees')} />
          <span>Chỉnh sửa Khoản Phí</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <Form.Item
              name="name"
              label="Tên khoản phí"
              rules={[{ required: true, message: 'Vui lòng nhập tên phí' }]}
            >
              <Input />
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
            
             <Form.Item 
              name="isActive" 
              label="Trạng thái hoạt động" 
              valuePropName="checked"
            >
              <Switch checkedChildren="Đang dùng" unCheckedChildren="Đã ẩn" />
            </Form.Item>
          </div>
        </div>

        <Form.Item name="description" label="Mô tả chi tiết">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditFee;