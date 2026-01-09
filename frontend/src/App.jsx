// File: frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, message, Dropdown, Avatar, Space } from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  LogoutOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  DownOutlined,
  UserAddOutlined
} from '@ant-design/icons';

import LoginScreen from './pages/LoginScreen';
import BillList from './pages/bill/BillList';
import FeeList from './pages/fee/FeeList';
import HouseholdList from './pages/household/HouseholdList';
import AddHousehold from './pages/household/AddHousehold';
import EditHousehold from './pages/household/EditHousehold';
import AddFee from './pages/fee/AddFee';
import EditFee from './pages/fee/EditFee';
import PaymentBill from './pages/bill/PaymentBill';
import Dashboard from './pages/Dashboard';
// Import component Modal vừa tạo
import RegisterModal from './components/RegisterModal';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo')) || { username: 'Admin', role: 'guest' };
  
  // State quản lý việc hiển thị Modal Đăng ký
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    // Lưu ý: Token cookie httpOnly vẫn còn, nhưng without credentials hoặc 
    // logic backend sẽ chặn nếu ta xóa client state. 
    // Để sạch sẽ nhất, thường ta sẽ gọi 1 API /logout để xóa cookie (nếu cần).
    message.success('Đã đăng xuất!');
    window.location.href = '/login';
  };

  const getActiveKey = () => {
    const path = location.pathname;
    if (path.startsWith('/households')) return '/households';
    if (path.startsWith('/fees')) return '/fees';
    if (path.startsWith('/bills')) return '/bills';
    return '/';
  };

  const sideMenuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Tổng quan</Link>,
    },
    {
      key: '/households',
      icon: <UsergroupAddOutlined />,
      label: <Link to="/households">Quản lý Hộ khẩu</Link>,
    },
    {
      key: '/fees',
      icon: <DollarOutlined />,
      label: <Link to="/fees">Quản lý Phí</Link>,
    },
    {
      key: '/bills',
      icon: <FileTextOutlined />,
      label: <Link to="/bills">Quản lý Hóa đơn</Link>,
    },
  ];

  // Định nghĩa menu cho Dropdown User
  const userMenuItems = [
    // Chỉ hiện nút Đăng ký nếu role là Admin
    ...(user.role === 'bqt_admin' ? [{
      key: 'register',
      icon: <UserAddOutlined />,
      label: 'Đăng ký tài khoản mới',
      onClick: () => setIsRegisterModalOpen(true)
    }] : []),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="dark">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: '#fff', lineHeight: '32px', fontWeight: 'bold' }}>
          BlueMoon
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={sideMenuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,0.08)' }}>
          <h3 style={{ margin: 0 }}>Hệ thống quản lý chung cư</h3>
          
          {/* Thay nút Logout cũ bằng Dropdown Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <Button type="text" style={{ height: 'auto', padding: '4px 8px' }}>
                <Space>
                  <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                  <span style={{ fontWeight: 500 }}>{user.username}</span>
                  <DownOutlined style={{ fontSize: '10px' }} />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
            {children}
          </div>
        </Content>
      </Layout>

      {/* Nhúng Modal Register vào đây */}
      <RegisterModal 
        open={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </Layout>
  );
};

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

function App() {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginScreen />} />

        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        <Route path="/households" element={<PrivateRoute><HouseholdList /></PrivateRoute>} />
        <Route path="/households/add" element={<PrivateRoute><AddHousehold /></PrivateRoute>} />
        <Route path="/households/edit/:id" element={<PrivateRoute><EditHousehold /></PrivateRoute>} />

        <Route path="/fees" element={<PrivateRoute><FeeList /></PrivateRoute>} />
        <Route path="/fees/add" element={<PrivateRoute><AddFee /></PrivateRoute>} />
        <Route path="/fees/edit/:id" element={<PrivateRoute><EditFee /></PrivateRoute>} />

        <Route path="/bills" element={<PrivateRoute><BillList /></PrivateRoute>} />
        <Route path="/bills/pay/:id" element={<PrivateRoute><PaymentBill /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;