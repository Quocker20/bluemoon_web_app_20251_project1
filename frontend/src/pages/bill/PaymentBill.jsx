// File: frontend/src/pages/bill/PaymentBill.jsx
import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Table, Button, Tag, message, Typography, Divider, Space, Radio } from 'antd';
import { ArrowLeftOutlined, DollarOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const { Title, Text } = Typography;

const PaymentBill = () => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY'); // Mặc định chọn VNPAY
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Lấy thông tin user để phân quyền
  const user = JSON.parse(localStorage.getItem('userInfo')) || {};
  const isAdmin = user.role === 'bqt_admin';

  useEffect(() => {
    // Nếu là Admin thì ưu tiên chọn Tiền mặt cho nhanh
    if (isAdmin) setPaymentMethod('CASH');

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
  }, [id, navigate, isAdmin]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (paymentMethod === 'CASH') {
        // --- CÁCH 1: TIỀN MẶT (Chỉ Admin) ---
        if (!window.confirm('Xác nhận đã thu đủ tiền mặt?')) {
          setProcessing(false);
          return;
        }
        await axiosClient.put(`/bills/${id}/pay`);
        message.success('Thanh toán tiền mặt thành công!');
        navigate('/bills');

      } else {
        // --- CÁCH 2: VNPAY (Online) ---
        const res = await axiosClient.post('/payment/create_payment_url', {
          billId: bill._id,
          amount: bill.totalAmount
        });
        
        if (res.data.paymentUrl) {
          // Chuyển hướng trình duyệt sang trang thanh toán của VNPAY
          window.location.href = res.data.paymentUrl;
        } else {
          message.error('Lỗi không tạo được link thanh toán');
        }
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Lỗi thanh toán');
    } finally {
      // Nếu là VNPAY thì không tắt loading ngay để người dùng đợi chuyển trang
      if (paymentMethod === 'CASH') setProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;
  if (!bill) return null;

  const columns = [
    { title: 'Khoản phí', dataIndex: 'feeName', key: 'feeName' },
    { title: 'Đơn giá', dataIndex: 'unitPrice', render: v => v?.toLocaleString() },
    { title: 'Số lượng', dataIndex: 'quantity' },
    { title: 'Thành tiền', dataIndex: 'amount', render: v => <b>{v?.toLocaleString()} đ</b> },
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

      {/* Chỉ hiện khu vực thanh toán nếu hóa đơn chưa trả */}
      {bill.status === 'Unpaid' && (
        <div style={{ marginTop: 30, padding: 20, background: '#f9f9f9', borderRadius: 8 }}>
          <Title level={5}>Chọn phương thức thanh toán:</Title>
          
          <Radio.Group 
            onChange={e => setPaymentMethod(e.target.value)} 
            value={paymentMethod}
            style={{ marginBottom: 20 }}
          >
            {/* Chỉ Admin mới thấy nút Tiền mặt */}
            {isAdmin && (
              <Radio.Button value="CASH" style={{ height: 50, lineHeight: '50px', padding: '0 30px' }}>
                <DollarOutlined /> Tiền mặt
              </Radio.Button>
            )}
            
            <Radio.Button value="VNPAY" style={{ height: 50, lineHeight: '50px', padding: '0 30px', marginLeft: isAdmin ? 10 : 0 }}>
              <QrcodeOutlined /> Thanh toán Online (VNPAY)
            </Radio.Button>
          </Radio.Group>

          <div>
            <Button 
              type="primary" 
              size="large" 
              onClick={handlePayment}
              loading={processing}
              style={{ 
                minWidth: 200, 
                height: 50,
                backgroundColor: paymentMethod === 'CASH' ? '#52c41a' : '#005baa' 
              }}
            >
              {paymentMethod === 'CASH' ? 'XÁC NHẬN THU TIỀN' : 'THANH TOÁN NGAY'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PaymentBill;