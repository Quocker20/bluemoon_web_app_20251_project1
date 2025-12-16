import React, { useEffect, useState } from 'react';
import { message, Table, Button, Space, Typography, Tag, Popconfirm, Modal, Descriptions, List, Avatar, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Search } = Input;

const HouseholdList = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  const fetchHouseholds = async (keyword = '') => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/households', {
        params: { keyword }
      });
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
      message.success('Đã xóa hộ khẩu thành công!');
      fetchHouseholds();
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        message.error('Xóa thất bại, kiểm tra công nợ của hộ khẩu!');
      }, 0);
    }
  };

  const handleViewDetail = (record) => {
    setSelectedHousehold(record);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const columns = [
    {
      title: 'Số hộ khẩu',
      dataIndex: 'householdNumber',
      key: 'householdNumber',
      width: '15%',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Chủ hộ',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: '20%',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'CCCD Chủ hộ',
      dataIndex: 'ownerCCCD',
      key: 'ownerCCCD',
      width: '15%',
      render: (text) => <span style={{ color: '#1890ff', fontWeight: 500 }}>{text || '---'}</span>
    },
    {
      title: 'Diện tích',
      dataIndex: 'area',
      key: 'area',
      width: '10%',
      render: (area) => <Tag color="blue">{area} m²</Tag>,
    },
    {
      title: 'Nhân khẩu',
      key: 'members',
      width: '15%',
      render: (_, record) => {
        const totalMembers = (record.residents ? record.residents.length : 0) + 1;
        return <span>{totalMembers} người</span>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '25%',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
          >
          </Button>

          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            size="small"
            onClick={() => navigate(`/households/edit/${record._id}`)}
          >
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
        <Space>
          <Search
            placeholder="Tìm theo số hộ khẩu..."
            onSearch={(value) => fetchHouseholds(value)}
            allowClear
            enterButton
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/households/add')}
          >
            Thêm hộ mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={households}
        rowKey="_id"
        loading={loading}
        bordered
      />

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
              <Descriptions.Item label="CCCD Chủ hộ">
                <b style={{ color: '#1890ff' }}>{selectedHousehold.ownerCCCD}</b>
              </Descriptions.Item>
              <Descriptions.Item label="SĐT Liên hệ">{selectedHousehold.phone}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 20 }}>Danh sách nhân khẩu ({(selectedHousehold.residents?.length || 0) + 1})</Title>

            <List
              itemLayout="horizontal"
            >
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                  title={selectedHousehold.ownerName}
                  description={
                    <Space>
                      <Tag color="gold">Chủ hộ</Tag>
                      <span>CCCD: {selectedHousehold.ownerCCCD}</span>
                    </Space>
                  }
                />
              </List.Item>

              {selectedHousehold.residents?.map((item, index) => (
                <List.Item key={index}>
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
              ))}
            </List>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HouseholdList;