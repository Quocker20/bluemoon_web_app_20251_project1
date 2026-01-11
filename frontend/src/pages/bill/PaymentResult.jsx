// File: frontend/src/pages/bill/PaymentResult.jsx
import React, { useEffect, useState } from 'react';
import { Result, Button, Card, Spin, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [msg, setMsg] = useState('Đang xử lý kết quả...');

  useEffect(() => {
    const checkResult = async () => {
      try {
        // Lấy chuỗi query params từ URL (vnp_Amount, vnp_ResponseCode...)
        const queryStr = location.search; 

        if (!queryStr) {
            setLoading(false);
            setStatus('error');
            setMsg('Không tìm thấy thông tin giao dịch.');
            return;
        }

        // Gọi về Backend để verify chữ ký và update DB
        const res = await axiosClient.get(`/payment/vnpay_return${queryStr}`);
        
        if (res.data.code === '00') {
            setStatus('success');
            setMsg('Thanh toán thành công! Hóa đơn đã được cập nhật.');
            message.success('Gạch nợ hóa đơn thành công!');
        } else {
            setStatus('error');
            setMsg(res.data.message || 'Giao dịch thất bại.');
        }
      } catch (error) {
        console.error(error);
        setStatus('error');
        setMsg('Có lỗi xảy ra khi xác nhận thanh toán.');
      } finally {
        setLoading(false);
      }
    };

    checkResult();
  }, [location.search]);

  if (loading) {
    return (
        <Card style={{ marginTop: 50, textAlign: 'center', maxWidth: 600, margin: '50px auto' }}>
            <Spin size="large" />
            <p style={{ marginTop: 20 }}>Đang xác thực giao dịch với VNPAY...</p>
        </Card>
    );
  }

  return (
    <Card style={{ marginTop: 50, maxWidth: 600, margin: '50px auto' }}>
      {status === 'success' ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={msg}
          extra={[
            <Button type="primary" key="console" onClick={() => navigate('/bills')}>
              Về danh sách hóa đơn
            </Button>,
            <Button key="dashboard" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Thanh toán thất bại"
          subTitle={msg}
          extra={[
            <Button type="primary" key="console" onClick={() => navigate('/bills')}>
              Thử lại / Về danh sách
            </Button>,
          ]}
        />
      )}
    </Card>
  );
};

export default PaymentResult;