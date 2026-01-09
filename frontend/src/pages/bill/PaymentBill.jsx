import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Table, Button, Tag, message, Typography, Divider, Space } from 'antd';
import { ArrowLeftOutlined, DollarOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const { Title, Text } = Typography;

const PaymentBill = () => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillDetail = async () => {
      try {
        const { data } = await axiosClient.get(`/bills/${id}`);
        setBill(data);
      } catch (error) {
        message.error('Không tìm thấy hóa đơn');
        console.log(error);
        navigate('/bills');
      } finally {
        setLoading(false);
      }
    };
    fetchBillDetail();
  }, [id, navigate]);

  const handleConfirmPayment = async () => {
    if (!window.confirm('Xác nhận đã thu đủ tiền cho hóa đơn này?')) return;
    
    setProcessing(true);
    try {
      await axiosClient.put(`/bills/${id}/pay`);
      message.success('Thanh toán thành công!');
      navigate('/bills');
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi thanh toán');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;
  if (!bill) return null;

  const columns = [
    { title: 'Khoản phí', dataIndex: 'feeName', key: 'feeName' },
    { title: 'Đơn giá', dataIndex: 'unitPrice', render: v => v.toLocaleString() },
    { title: 'Số lượng', dataIndex: 'quantity' },
    { title: 'Thành tiền', dataIndex: 'amount', render: v => <b>{v.toLocaleString()} đ</b> },
  ];

  return (
    <Card 
      title={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/bills')} />
          <span>Thanh toán Hóa đơn: {bill.title}</span>
        </Space>
      }
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Căn hộ"><b>{bill.household?.householdNumber}</b></Descriptions.Item>
        <Descriptions.Item label="Chủ hộ">{bill.household?.ownerName}</Descriptions.Item>
        <Descriptions.Item label="Tháng/Năm">{bill.month}/{bill.year}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {bill.status === 'Paid' 
            ? <Tag color="green">Đã thanh toán</Tag> 
            : <Tag color="orange">Chưa thanh toán</Tag>
          }
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={5}>Chi tiết phí</Title>
      <Table 
        dataSource={bill.items} 
        columns={columns} 
        pagination={false} 
        rowKey="_id"
        bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3} style={{ textAlign: 'right' }}>
              <Text strong>TỔNG CỘNG:</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <Text type="danger" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {bill.totalAmount?.toLocaleString()} VNĐ
              </Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <div style={{ marginTop: 20, textAlign: 'right' }}>
        {bill.status === 'Unpaid' && (
          <Button 
            type="primary" 
            size="large" 
            icon={<DollarOutlined />} 
            onClick={handleConfirmPayment}
            loading={processing}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            XÁC NHẬN ĐÃ THU TIỀN
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PaymentBill;