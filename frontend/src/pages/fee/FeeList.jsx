import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import axios from 'axios';

const FeeList = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        // Đảm bảo port backend đúng (thường là 5000)
        const { data } = await axios.get('http://localhost:5000/api/fees');
        setFees(data);
      } catch (error) {
        console.error("Lỗi tải phí:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const columns = [
    { title: 'Tên phí', dataIndex: 'name', key: 'name', render: text => <b>{text}</b> },
    { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', render: val => val?.toLocaleString() + ' đ' },
    { title: 'Đơn vị', dataIndex: 'calculationUnit', key: 'calculationUnit' },
    { 
      title: 'Loại', 
      dataIndex: 'isMandatory', 
      key: 'isMandatory', 
      render: (isMan) => isMan ? <Tag color="red">Bắt buộc</Tag> : <Tag color="green">Tự nguyện</Tag> 
    }
  ];

  return (
    <Card title="Danh sách Phí dịch vụ">
      <Table 
        dataSource={fees} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
      />
    </Card>
  );
};

export default FeeList;