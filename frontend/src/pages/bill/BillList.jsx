import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Modal, Form, InputNumber, message, Space, Typography, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, DollarOutlined } from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { Search } = Input;

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  // 1. Lấy thông tin User hiện tại từ LocalStorage để check quyền
  const user = JSON.parse(localStorage.getItem('userInfo')) || {};

  const fetchBills = async (keyword = '') => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/bills', {
        params: { keyword }
      });
      setBills(data);
    } catch (error) {
      console.error("Lỗi tải hóa đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleGenerateBills = async (values) => {
    setCreating(true);
    try {
      const res = await axiosClient.post('/bills/generate', {
        month: values.month,
        year: values.year
      });
      message.success(res.data.message);
      setIsModalOpen(false);
      fetchBills();
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi tạo hóa đơn');
    } finally {
      setCreating(false);
    }
  };

  const expandedRowRender = (record) => {
    const detailColumns = [
      { title: 'Khoản phí', dataIndex: 'feeName', key: 'feeName' },
      { 
        title: 'Đơn giá', 
        dataIndex: 'unitPrice', 
        key: 'unitPrice',
        render: (val) => val.toLocaleString()
      },
      { 
        title: 'Số lượng', 
        dataIndex: 'quantity', 
        key: 'quantity',
        render: (val) => <Text strong>{val}</Text>
      },
      { 
        title: 'Thành tiền', 
        dataIndex: 'amount', 
        key: 'amount',
        render: (val) => <Text type="danger">{val.toLocaleString()} đ</Text>
      },
    ];

    return (
      <Table 
        columns={detailColumns} 
        dataSource={record.items} 
        pagination={false} 
        rowKey={(item) => item._id || item.feeName}
        size="small" 
        bordered
      />
    );
  };

  const columns = [
    { 
      title: 'Căn hộ', 
      dataIndex: 'household', 
      key: 'household',
      render: (hh) => hh ? <b>{hh.householdNumber}</b> : 'N/A'
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (val) => <span style={{color: '#d4380d', fontWeight: 'bold', fontSize: '16px'}}>{val?.toLocaleString()} đ</span>
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => status === 'Paid' 
        ? <Tag color="green">Đã đóng</Tag> 
        : <Tag color="orange">Chưa đóng</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        // Logic: Chỉ hiện nút Thu tiền nếu (Chưa thanh toán) VÀ (Là Admin)
        record.status === 'Unpaid' && user.role === 'bqt_admin' && (
          <Button 
            type="primary" 
            size="small"
            icon={<DollarOutlined />}
            onClick={() => navigate(`/bills/pay/${record._id}`)}
          >
            Thu tiền
          </Button>
        )
      )
    }
  ];

  return (
    <Card 
      title="Danh sách Hóa đơn" 
      extra={
        <Space>
          <Search
            placeholder="Tìm theo số căn hộ..."
            onSearch={(value) => fetchBills(value)}
            allowClear
            enterButton
            style={{ width: 250 }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => fetchBills()}>Làm mới</Button>
          
          {/* Chỉ Admin mới được thấy nút "Tính hóa đơn tháng mới" */}
          {user.role === 'bqt_admin' && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => {
                setIsModalOpen(true);
                const now = new Date();
                form.setFieldsValue({
                  month: now.getMonth() + 1,
                  year: now.getFullYear()
                });
              }}
            >
              Tính hóa đơn tháng mới
            </Button>
          )}
        </Space>
      }
    >
      <Table 
        dataSource={bills} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.items && record.items.length > 0,
        }}
      />

      <Modal
        title="Lập hóa đơn thu phí định kỳ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} 
      >
        <p>Hệ thống sẽ tự động tính toán phí cho tất cả các căn hộ dựa trên diện tích và nhân khẩu hiện tại.</p>
        <Form form={form} layout="vertical" onFinish={handleGenerateBills}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Form.Item name="month" label="Tháng" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={1} max={12} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="year" label="Năm" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={2020} max={2050} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={creating} block>
              Xác nhận Tính toán & Tạo hóa đơn
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BillList;