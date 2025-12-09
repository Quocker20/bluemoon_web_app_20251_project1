// File: frontend/src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeOutlined, DollarOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const DashboardLayout = () => {
    const location = useLocation();

    // Xác định menu nào đang được chọn dựa trên URL hiện tại
    const getSelectedKey = () => {
        if (location.pathname.includes('/admin/households')) return '1';
        if (location.pathname.includes('/admin/fees')) return '2';
        if (location.pathname.includes('/admin/bills')) return '3'; // Key mới cho Bills
        if (location.pathname.includes('/admin/reports')) return '4';
        return '1';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible width={250} style={{ padding: '20px 0' }}>
                <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', color: 'white', lineHeight: '32px', fontWeight: 'bold' }}>
                    BLUEMOON ADMIN
                </div>
                <Menu theme="dark" selectedKeys={[getSelectedKey()]} mode="inline">
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to="/admin/households">Quản lý Hộ khẩu</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DollarOutlined />}>
                        <Link to="/admin/fees">Quản lý Khoản thu</Link>
                    </Menu.Item>
                    {/* MENU MỚI */}
                    <Menu.Item key="3" icon={<FileTextOutlined />}>
                        <Link to="/admin/bills">Quản lý Hóa đơn</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<BarChartOutlined />}>
                         <Link to="/admin/reports">Báo cáo thống kê</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: '#fff' }} />
                <Content style={{ margin: '24px 16px' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                        <Outlet /> 
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;