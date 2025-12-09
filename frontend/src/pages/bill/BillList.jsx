import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Modal, Form, InputNumber, message, Space, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal tạo hóa đơn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  // Hàm lấy dữ liệu
  const fetchBills = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/bills');
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

  // Xử lý tính toán hóa đơn mới
  const handleGenerateBills = async (values) => {
    setCreating(true);
    try {
      const res = await axios.post('http://localhost:5000/api/bills/generate', {
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

  // --- CẤU HÌNH BẢNG CON (CHI TIẾT PHÍ) ---
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
        size="small" // Bảng nhỏ gọn hơn
        bordered
      />
    );
  };
  // ----------------------------------------

  // Cấu hình bảng cha (Danh sách hóa đơn)
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
    }
  ];

  return (
    <Card 
      title="Danh sách Hóa đơn" 
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchBills}>Làm mới</Button>
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
        </Space>
      }
    >
      <Table 
        dataSource={bills} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
        // --- KÍCH HOẠT TÍNH NĂNG BẢNG LỒNG NHAU ---
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.items && record.items.length > 0,
        }}
        // -------------------------------------------
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