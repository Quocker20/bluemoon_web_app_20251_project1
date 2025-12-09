import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  LogoutOutlined,
  HomeOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';

// --- IMPORT CÁC MÀN HÌNH ---
import LoginScreen from './pages/LoginScreen';
import BillList from './pages/bill/BillList';
import FeeList from './pages/fee/FeeList';
import HouseholdList from './pages/household/HouseholdList';
import AddHousehold from './pages/household/AddHousehold';
import EditHousehold from './pages/household/EditHousehold';
import AddFee from './pages/fee/AddFee';
import EditFee from './pages/fee/EditFee';
import PaymentBill from './pages/bill/PaymentBill';
// ------------------------------------------

const { Header, Sider, Content } = Layout;

// 1. Layout Chính
const MainLayout = ({ children }) => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const user = JSON.parse(localStorage.getItem('userInfo')) || { username: 'Admin' };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    message.success('Đã đăng xuất!');
    window.location.href = '/login';
  };

  // Hàm xác định menu nào đang sáng dựa trên URL hiện tại
  const getActiveKey = () => {
    const path = location.pathname;

    // Nếu đang ở bất kỳ trang nào bắt đầu bằng /households -> Sáng menu Hộ khẩu
    if (path.startsWith('/households')) return '/households';

    // Tương tự cho Phí và Hóa đơn
    if (path.startsWith('/fees')) return '/fees';
    if (path.startsWith('/bills')) return '/bills';

    // Mặc định là trang chủ
    return '/';
  };

  const menuItems = [
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
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Hệ thống quản lý chung cư</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Xin chào, <b>{user.username}</b></span>
            <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

// 2. Component bảo vệ
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

// 3. App Component
function App() {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginScreen />} />

        {/* --- CÁC ROUTE ĐƯỢC BẢO VỆ --- */}
        <Route path="/" element={<PrivateRoute><h2>Trang Tổng quan</h2></PrivateRoute>} />

        {/* QUẢN LÝ HỘ KHẨU */}
        <Route path="/households" element={<PrivateRoute><HouseholdList /></PrivateRoute>} />
        <Route path="/households/add" element={<PrivateRoute><AddHousehold /></PrivateRoute>} />
        <Route path="/households/edit/:id" element={<PrivateRoute><EditHousehold /></PrivateRoute>} />

        {/* QUẢN LÝ PHÍ */}
        <Route path="/fees" element={<PrivateRoute><FeeList /></PrivateRoute>} />
        {/* --- [MỚI] Thêm 2 route cho Phí --- */}
        <Route path="/fees/add" element={<PrivateRoute><AddFee /></PrivateRoute>} />
        <Route path="/fees/edit/:id" element={<PrivateRoute><EditFee /></PrivateRoute>} />
        {/* ---------------------------------- */}

        {/* QUẢN LÝ HÓA ĐƠN */}
        <Route path="/bills" element={<PrivateRoute><BillList /></PrivateRoute>} />
        <Route path="/bills/pay/:id" element={<PrivateRoute><PaymentBill /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;