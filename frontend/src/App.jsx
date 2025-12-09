import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import { 
  FileTextOutlined, 
  DollarOutlined, 
  LogoutOutlined, 
  HomeOutlined,
  UsergroupAddOutlined // Icon cho Hộ khẩu
} from '@ant-design/icons';

// --- IMPORT ĐÚNG THEO CẤU TRÚC THƯ MỤC TRONG ẢNH ---
import LoginScreen from './pages/LoginScreen';
import BillList from './pages/bill/BillList';
import FeeList from './pages/fee/FeeList';
// Giả định file danh sách hộ khẩu nằm ở đây (theo quy tắc đặt tên của bạn)
// Nếu tên file của bạn khác (ví dụ HouseholdManager.jsx), hãy sửa dòng này
import HouseholdList from './pages/household/HouseholdList'; 

const { Header, Sider, Content } = Layout;

// 1. Component Layout chính
const MainLayout = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo')) || { username: 'Admin' };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    message.success('Đã đăng xuất!');
    window.location.href = '/login';
  };

  // MENU ĐẦY ĐỦ 3 CHỨC NĂNG
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Tổng quan</Link>,
    },
    {
      key: '/households',
      icon: <UsergroupAddOutlined />,
      label: <Link to="/households">Quản lý Hộ khẩu</Link>, // Đã thêm lại
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
          selectedKeys={[location.pathname]} 
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

// 2. Component bảo vệ Route
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

        {/* --- CÁC ROUTE CẦN ĐĂNG NHẬP --- */}
        
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

        {/* Trang Quản lý Hộ khẩu (ĐÃ KHÔI PHỤC) */}
        <Route
          path="/households"
          element={
            <PrivateRoute>
              <HouseholdList />
            </PrivateRoute>
          }
        />

        {/* Trang Quản lý Phí */}
        <Route
          path="/fees"
          element={
            <PrivateRoute>
              <FeeList />
            </PrivateRoute>
          }
        />

        {/* Trang Quản lý Hóa đơn */}
        <Route
          path="/bills"
          element={
            <PrivateRoute>
              <BillList />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;