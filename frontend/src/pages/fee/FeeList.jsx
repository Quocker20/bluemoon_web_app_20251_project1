// File: src/pages/fee/FeeList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Popconfirm, message } from 'antd'; // Thêm các component UI
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Thêm Icon
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeeList = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Tách hàm fetch ra ngoài để tái sử dụng sau khi Xóa
  const fetchFees = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/fees');
      setFees(data);
    } catch (error) {
      console.error("Lỗi tải phí:", error);
      message.error("Không tải được danh sách phí");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  // 2. Hàm xử lý Xóa
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/fees/${id}`);
      message.success('Đã xóa khoản phí');
      fetchFees(); // Load lại danh sách ngay sau khi xóa
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi xóa phí');
    }
  };

  const columns = [
    { title: 'Tên phí', dataIndex: 'name', key: 'name', render: text => <b>{text}</b> },
    { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', render: val => val?.toLocaleString() + ' đ' },
    { title: 'Đơn vị', dataIndex: 'calculationUnit', key: 'calculationUnit' },
    { 
      title: 'Loại', 
      dataIndex: 'isMandatory', 
      key: 'isMandatory', 
      render: (isMan) => isMan ? <Tag color="red">Bắt buộc</Tag> : <Tag color="green">Tự nguyện</Tag> 
    },
    // --- CỘT HÀNH ĐỘNG (Giống bên Hộ khẩu) ---
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {/* Nút Sửa */}
          <Button 
            type="primary" 
            ghost 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => navigate(`/fees/edit/${record._id}`)}
          />

          {/* Nút Xóa có xác nhận */}
          <Popconfirm 
            title="Bạn chắc chắn muốn xóa phí này?" 
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              type="primary" 
              danger 
              size="small"
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card 
      title="Danh sách Phí dịch vụ"
      // --- NÚT THÊM MỚI ---
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/fees/add')}
        >
          Thêm phí mới
        </Button>
      }
    >
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