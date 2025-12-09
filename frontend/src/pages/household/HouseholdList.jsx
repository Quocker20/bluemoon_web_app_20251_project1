// File: frontend/src/pages/household/HouseholdList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Tag, Popconfirm, Modal, Descriptions, List, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const { Title } = Typography;

const HouseholdList = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State cho Modal Xem chi tiết
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/households');
      setHouseholds(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/households/${id}`);
      toast.success('Đã xóa thành công!');
      fetchHouseholds();
    } catch (error) {
      toast.error('Lỗi khi xóa hộ khẩu');
      console.log(error);
    }
  };

  // Hàm mở Modal Xem chi tiết
  const handleViewDetail = (record) => {
    setSelectedHousehold(record); // Lưu thông tin dòng đang chọn
    setIsViewModalOpen(true);     // Mở Modal lên
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const columns = [
    {
      title: 'Số hộ khẩu',
      dataIndex: 'householdNumber',
      key: 'householdNumber',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Chủ hộ',
      dataIndex: 'ownerName',
      key: 'ownerName',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Diện tích',
      dataIndex: 'area',
      key: 'area',
      render: (area) => <Tag color="blue">{area} m²</Tag>,
    },
    {
      title: 'Nhân khẩu',
      key: 'members',
      render: (_, record) => (
        <span>{record.residents ? record.residents.length : 0} người</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* NÚT XEM: Đã gắn hàm handleViewDetail */}
          <Button 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          
          <Button 
            icon={<EditOutlined />} 
            type="primary" 
            ghost 
            size="small"
            onClick={() => navigate(`/admin/households/edit/${record._id}`)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa hộ khẩu này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} type="primary" danger size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Quản lý Hộ khẩu</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/admin/households/new')}
        >
          Thêm hộ mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={households} 
        rowKey="_id"
        loading={loading}
        bordered
      />

      {/* === MODAL XEM CHI TIẾT === */}
      <Modal
        title="Chi Tiết Hộ Khẩu"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedHousehold && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Số hộ khẩu"><b>{selectedHousehold.householdNumber}</b></Descriptions.Item>
              <Descriptions.Item label="Diện tích">{selectedHousehold.area} m²</Descriptions.Item>
              <Descriptions.Item label="Chủ hộ">{selectedHousehold.ownerName}</Descriptions.Item>
              <Descriptions.Item label="SĐT Liên hệ">{selectedHousehold.phone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{selectedHousehold.address}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 20 }}>Danh sách nhân khẩu ({selectedHousehold.residents?.length || 0})</Title>
            
            <List
              itemLayout="horizontal"
              dataSource={selectedHousehold.residents}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}
                    title={item.residentName}
                    description={
                      <Space>
                        <Tag color="blue">{item.relationToOwner}</Tag>
                        <span>CCCD: {item.cccd || 'Chưa có'}</span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HouseholdList;