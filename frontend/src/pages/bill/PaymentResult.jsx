// File: frontend/src/pages/bill/PaymentResult.jsx
import React from 'react';
import { Result, Button, Card } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy tham số từ URL
  const params = new URLSearchParams(location.search);
  const responseCode = params.get('vnp_ResponseCode');

  // Logic xác định trạng thái (Tính trực tiếp, KHÔNG dùng useState/useEffect để tránh lỗi lặp)
  // Mã '00' của VNPAY nghĩa là Thành công
  let status = 'error';
  if (responseCode === '00') {
    status = 'success';
  } else if (!responseCode) {
    status = 'warning'; // Trường hợp vào trang này mà không có mã gì
  }

  // Giao diện khi không có mã giao dịch (người dùng tự gõ link vào)
  if (status === 'warning') {
    return (
      <Card style={{ marginTop: 50, maxWidth: 600, margin: '50px auto', textAlign: 'center' }}>
        <Result
          status="warning"
          title="Không tìm thấy kết quả"
          subTitle="Vui lòng thực hiện thanh toán từ trang hóa đơn."
          extra={[
            <Button type="primary" key="back" onClick={() => navigate('/bills')}>
              Về danh sách hóa đơn
            </Button>
          ]}
        />
      </Card>
    );
  }

  return (
    <Card style={{ marginTop: 50, maxWidth: 600, margin: '50px auto' }}>
      {status === 'success' ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle="Hóa đơn của bạn đã được gạch nợ. Cảm ơn bạn đã sử dụng dịch vụ."
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
          subTitle="Có lỗi xảy ra hoặc bạn đã hủy giao dịch. Vui lòng thử lại."
          extra={[
            <Button type="primary" key="console" onClick={() => navigate('/bills')}>
              Thử lại
            </Button>,
          ]}
        />
      )}
    </Card>
  );
};

export default PaymentResult;