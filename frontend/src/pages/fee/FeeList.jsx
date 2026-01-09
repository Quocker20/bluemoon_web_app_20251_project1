import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Popconfirm, message, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const FeeList = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFees = async (keyword = '') => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/fees', {
        params: { keyword }
      });
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

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/fees/${id}`);
      message.success('Đã xóa khoản phí');
      fetchFees();
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
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            ghost 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => navigate(`/fees/edit/${record._id}`)}
          />

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
      extra={
        <Space>
          <Search
            placeholder="Tìm tên khoản phí..."
            onSearch={(value) => fetchFees(value)}
            allowClear
            enterButton
            style={{ width: 250 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/fees/add')}
          >
            Thêm phí mới
          </Button>
        </Space>
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