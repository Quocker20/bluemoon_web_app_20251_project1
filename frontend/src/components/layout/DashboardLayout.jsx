// File: frontend/src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeOutlined, DollarOutlined, FileTextOutlined, BarChartOutlined, DashboardOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const DashboardLayout = () => {
    const location = useLocation();

    // Sửa logic xác định menu active
    const getSelectedKey = () => {
        const path = location.pathname;
        if (path === '/') return '0'; // Dashboard
        if (path.startsWith('/households')) return '1';
        if (path.startsWith('/fees')) return '2';
        if (path.startsWith('/bills')) return '3';
        if (path.startsWith('/reports')) return '4';
        return '0';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible width={250} style={{ padding: '20px 0' }}>
                <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', color: 'white', lineHeight: '32px', fontWeight: 'bold' }}>
                    BLUEMOON ADMIN
                </div>
                <Menu theme="dark" selectedKeys={[getSelectedKey()]} mode="inline">
                    {/* Thêm menu về Trang chủ */}
                    <Menu.Item key="0" icon={<DashboardOutlined />}>
                        <Link to="/">Tổng quan</Link>
                    </Menu.Item>

                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to="/households">Quản lý Hộ khẩu</Link> 
                    </Menu.Item>
                    
                    <Menu.Item key="2" icon={<DollarOutlined />}>
                        <Link to="/fees">Quản lý Khoản thu</Link> 
                    </Menu.Item>
                    
                    <Menu.Item key="3" icon={<FileTextOutlined />}>
                        <Link to="/bills">Quản lý Hóa đơn</Link> 
                    </Menu.Item>
                    
                    <Menu.Item key="4" icon={<BarChartOutlined />}>
                         <Link to="/reports">Báo cáo thống kê</Link> 
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                {/* Header để trống hoặc thêm Breadcrumb nếu muốn */}
                <Header style={{ padding: 0, background: '#fff' }} />
                <Content style={{ margin: '24px 16px' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
                        <Outlet /> 
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;