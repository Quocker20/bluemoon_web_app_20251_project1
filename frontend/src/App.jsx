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

// !!! QUAN TRỌNG: Bạn cần đảm bảo đã tạo 2 file này trong thư mục pages/household
// Nếu chưa có, hãy tạo file rỗng trước để không bị lỗi code
import HouseholdAdd from './pages/household/AddHousehold';
import HouseholdEdit from './pages/household/EditHousehold';
// -----------------------------------------------------------------------

const { Header, Sider, Content } = Layout;

// 1. Layout Chính
const MainLayout = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo')) || { username: 'Admin' };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    message.success('Đã đăng xuất!');
    window.location.href = '/login';
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

  // Logic để highlight menu cha khi đang ở trang con (VD: đang ở /households/add vẫn sáng menu Hộ khẩu)
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key) && item.key !== '/')
    ? menuItems.find(item => location.pathname.startsWith(item.key)).key
    : '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="dark">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: '#fff', lineHeight: '32px', fontWeight: 'bold' }}>
          BlueMoon
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,0.08)' }}>
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

// 2. Bảo vệ Route
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
        {/* Route Login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginScreen />}
        />

        {/* --- KHU VỰC CẦN ĐĂNG NHẬP --- */}

        {/* Trang chủ */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <h2>Chào mừng đến với trang quản trị BlueMoon!</h2>
              <p>Vui lòng chọn chức năng ở menu bên trái.</p>
            </PrivateRoute>
          }
        />

        {/* 1. Danh sách */}
        <Route
          path="/households"
          element={
            <PrivateRoute>
              <HouseholdList />
            </PrivateRoute>
          }
        />
        {/* 2. Trang Thêm mới (Route con) */}
        <Route
          path="/households/add"
          element={
            <PrivateRoute>
              <HouseholdAdd />
            </PrivateRoute>
          }
        />
        {/* 3. Trang Sửa (Route con có tham số id) */}
        <Route
          path="/households/edit/:id"
          element={
            <PrivateRoute>
              <HouseholdEdit />
            </PrivateRoute>
          }
        />

        {/* === QUẢN LÝ PHÍ === */}
        <Route
          path="/fees"
          element={
            <PrivateRoute>
              <FeeList />
            </PrivateRoute>
          }
        />

        {/* === QUẢN LÝ HÓA ĐƠN === */}
        <Route
          path="/bills"
          element={
            <PrivateRoute>
              <BillList />
            </PrivateRoute>
          }
        />

        {/* Catch-all: Đường dẫn lạ -> Về trang chủ */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;