import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button} from 'antd';
import axios from 'axios';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Các cột hiển thị (KHÔNG CÓ CỘT HÀNH ĐỘNG/THANH TOÁN)
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
      render: (val) => <span style={{color: '#d4380d', fontWeight: 'bold'}}>{val?.toLocaleString()} đ</span>
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
        <Button onClick={fetchBills}>Làm mới danh sách</Button>
      }
    >
      <Table 
        dataSource={bills} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
      />
    </Card>
  );
};

export default BillList;